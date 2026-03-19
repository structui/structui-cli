import { execSync } from "node:child_process";
import https from "node:https";
import http from "node:http";
import path from "node:path";
import prompts from "prompts";
import { loadConfig } from "../core/config";
import { writeTextFile } from "../utils/fs";
import {
  accentText,
  divider,
  indent,
  mutedText,
  section,
  successText,
  titleText,
  warningText,
} from "../utils/console";

// ─── Types (mirrors src/setups/types.ts in StructUI) ─────────────────────────

type SetupType = "crm" | "erp" | "saas" | "auth";
type AuthProvider = "next-auth" | "better-auth" | "basic-auth" | "none";
type ColorPalette =
  | "slate" | "blue" | "indigo" | "violet" | "purple"
  | "rose" | "orange" | "emerald" | "teal" | "zinc";

interface SetupFile {
  path: string;
  content: string;
}

interface SetupIndexEntry {
  name: string;
  label: string;
  description: string;
  icon: string;
  pages: string[];
}

interface SetupIndex {
  setups: SetupIndexEntry[];
}

interface SetupDetail {
  name: string;
  label: string;
  files: SetupFile[];
  dependencies: string[];
  instructions: string[];
}

// ─── Fallback static list (used if API is unreachable) ───────────────────────

const FALLBACK_SETUPS: SetupIndexEntry[] = [
  { name: "crm",  label: "CRM",  icon: "👥", description: "Sign-in/up, dashboard, customers, deals, activities, reports.", pages: ["Dashboard","Customers","Deals","Activities","Reports","Profile"] },
  { name: "erp",  label: "ERP",  icon: "🏭", description: "Dashboard, inventory, orders, procurement, finance, HR, reports.",  pages: ["Dashboard","Inventory","Orders","Finance","HR","Reports","Profile"] },
  { name: "saas", label: "SaaS", icon: "🚀", description: "Landing page, dashboard, analytics, users, billing, settings.", pages: ["Landing","Dashboard","Analytics","Users","Billing","Settings","Profile"] },
  { name: "auth", label: "Auth", icon: "🔐", description: "Sign-in, sign-up, forgot password and a protected home page.",  pages: ["Sign In","Sign Up","Forgot Password","Protected Home"] },
];

const COLOR_CHOICES = [
  { title: "Slate",   value: "slate",   description: "Neutral cool gray" },
  { title: "Blue",    value: "blue",    description: "Classic blue" },
  { title: "Indigo",  value: "indigo",  description: "Deep indigo" },
  { title: "Violet",  value: "violet",  description: "Soft violet" },
  { title: "Purple",  value: "purple",  description: "Rich purple" },
  { title: "Rose",    value: "rose",    description: "Warm rose" },
  { title: "Orange",  value: "orange",  description: "Vibrant orange" },
  { title: "Emerald", value: "emerald", description: "Fresh emerald" },
  { title: "Teal",    value: "teal",    description: "Calm teal" },
  { title: "Zinc",    value: "zinc",    description: "Warm gray" },
];

const AUTH_CHOICES = [
  { title: "None",          value: "none",         description: "Skip — add it yourself later" },
  { title: "NextAuth.js",   value: "next-auth",    description: "next-auth v5 beta, Credentials provider" },
  { title: "Better Auth",   value: "better-auth",  description: "better-auth — modern, database-agnostic" },
  { title: "Basic Auth (JWT)", value: "basic-auth",description: "Custom JWT cookies — no third-party dependency" },
];

// ─── HTTP fetch helper ────────────────────────────────────────────────────────

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, (res) => {
      let body = "";
      res.on("data", (chunk: Buffer) => { body += chunk.toString(); });
      res.on("end", () => {
        try { resolve(JSON.parse(body) as T); }
        catch { reject(new Error("Failed to parse JSON response")); }
      });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Request timed out")); });
  });
}

function getBaseUrl(registryUrl: string): string {
  try {
    const u = new URL(registryUrl);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "https://structui.com";
  }
}

// ─── Main Command ─────────────────────────────────────────────────────────────

export async function setupCommand(args: string[]): Promise<void> {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const baseUrl = getBaseUrl(config.registryUrl);

  console.log();
  console.log(titleText("  Struct UI — Setup Generator"));
  console.log(indent(mutedText("Scaffold a production-ready Next.js app in seconds."), 2));
  console.log();

  // 1. Fetch available setups from StructUI API ───────────────────────────────

  let setupEntries: SetupIndexEntry[] = FALLBACK_SETUPS;
  try {
    const index = await fetchJson<SetupIndex>(`${baseUrl}/api/setups/index.json`);
    if (Array.isArray(index.setups) && index.setups.length > 0) {
      setupEntries = index.setups;
    }
  } catch {
    console.log(indent(mutedText("(Using offline setup list — could not reach registry)")));
  }

  // 2. Resolve setup type ────────────────────────────────────────────────────

  const rawArg = args[0]?.toLowerCase().trim() ?? "";
  let setupName: string | null = rawArg
    ? (setupEntries.find((s) => s.name === rawArg)?.name ?? null)
    : null;

  if (!setupName) {
    if (rawArg) {
      console.log(indent(warningText(`Unknown setup: "${rawArg}". Please choose from the list below.`)));
      console.log();
    }
    const res = await prompts({
      type: "select",
      name: "type",
      message: "Which setup would you like to scaffold?",
      choices: setupEntries.map((s) => ({
        title: `${s.icon}  ${s.label}`,
        value: s.name,
        description: s.description,
      })),
    });
    if (!res.type) { console.log(indent(mutedText("Canceled."))); return; }
    setupName = res.type as string;
  }

  const chosenSetup = setupEntries.find((s) => s.name === setupName);
  if (!chosenSetup) throw new Error(`Setup not found: ${setupName}`);

  // 3. Project title ─────────────────────────────────────────────────────────

  const titleRes = await prompts({
    type: "text",
    name: "title",
    message: "Project title?",
    initial: `${chosenSetup.label} App`,
    validate: (v: string) => v.trim().length > 0 || "Title cannot be empty",
  });
  if (!titleRes.title) { console.log(indent(mutedText("Canceled."))); return; }
  const projectTitle: string = titleRes.title.trim();

  // 4. Color palette ─────────────────────────────────────────────────────────

  const colorRes = await prompts({
    type: "select",
    name: "color",
    message: "Primary color palette?",
    choices: COLOR_CHOICES,
    initial: 1, // blue
  });
  if (!colorRes.color) { console.log(indent(mutedText("Canceled."))); return; }
  const colorPalette: ColorPalette = colorRes.color;

  // 5. Auth provider ─────────────────────────────────────────────────────────

  const authRes = await prompts({
    type: "select",
    name: "provider",
    message: "Authentication provider?",
    choices: AUTH_CHOICES,
  });
  if (authRes.provider === undefined) { console.log(indent(mutedText("Canceled."))); return; }
  const authProvider: AuthProvider = authRes.provider;

  // 6. Output location ───────────────────────────────────────────────────────

  const locationRes = await prompts({
    type: "select",
    name: "location",
    message: "Where would you like to place the generated files?",
    choices: [
      {
        title: "Main project (current directory)",
        value: "main",
        description: "Write files directly into your project — ready to run immediately",
      },
      {
        title: `struct/setups/${setupName}`,
        value: "struct",
        description: "Save as a reference template — copy manually when ready",
      },
    ],
  });
  if (!locationRes.location) { console.log(indent(mutedText("Canceled."))); return; }

  const outputToMain = locationRes.location === "main";
  const basePath = outputToMain ? cwd : path.join(cwd, "struct", "setups", setupName);

  // 7. Confirm ───────────────────────────────────────────────────────────────

  console.log();
  divider();
  console.log(indent(titleText("Summary")));
  console.log(indent(`Setup     ${accentText(chosenSetup.label)}`));
  console.log(indent(`Title     ${accentText(projectTitle)}`));
  console.log(indent(`Color     ${accentText(colorPalette)}`));
  console.log(indent(`Auth      ${accentText(authProvider)}`));
  console.log(indent(`Output    ${accentText(outputToMain ? "Current directory" : `struct/setups/${setupName}`)}`));
  divider();
  console.log();

  const confirmRes = await prompts({ type: "confirm", name: "ok", message: "Generate setup?", initial: true });
  if (!confirmRes.ok) { console.log(indent(mutedText("Canceled."))); return; }

  // 8. Fetch generated files from StructUI API ───────────────────────────────

  console.log();
  section("Fetching files from registry…");
  console.log();

  const params = new URLSearchParams({
    title: projectTitle,
    color: colorPalette,
    auth: authProvider,
  });

  let detail: SetupDetail;
  try {
    detail = await fetchJson<SetupDetail>(`${baseUrl}/api/setups/${setupName}?${params}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Failed to fetch setup files from registry: ${msg}\n  URL: ${baseUrl}/api/setups/${setupName}`);
  }

  if (!Array.isArray(detail.files) || detail.files.length === 0) {
    throw new Error("Registry returned an empty file list.");
  }

  // 9. Write files ───────────────────────────────────────────────────────────

  for (const file of detail.files) {
    const fullPath = path.join(basePath, file.path);
    await writeTextFile(fullPath, file.content);
    console.log(indent(successText("✓") + "  " + mutedText(file.path)));
  }

  // 10. Install dependencies ─────────────────────────────────────────────────

  if (outputToMain && detail.dependencies.length > 0) {
    console.log();
    divider();
    console.log(indent(mutedText(`Installing: ${detail.dependencies.join(", ")}…`)));
    try {
      execSync(`npm install ${detail.dependencies.join(" ")}`, { stdio: "inherit", cwd });
      console.log(indent(successText("Dependencies installed.")));
    } catch {
      console.log(indent(warningText(`Run manually: npm install ${detail.dependencies.join(" ")}`)));
    }
  }

  // 11. Done ─────────────────────────────────────────────────────────────────

  console.log();
  divider();
  console.log(indent(successText(`✓  ${chosenSetup.label} setup generated  (${detail.files.length} files)`)));
  console.log();

  if (!outputToMain) {
    console.log(indent(mutedText(`Saved to: struct/setups/${setupName}/`)));
    console.log(indent(mutedText("Copy into your project when ready.")));
    console.log();
  }

  if (detail.instructions && detail.instructions.length > 0) {
    console.log(indent(titleText("Next steps:")));
    detail.instructions.forEach((step, i) => {
      console.log(indent(`${i + 1}. ${mutedText(step)}`));
    });
    console.log();
  }

  if (outputToMain) {
    console.log(indent(mutedText("Run: npm run dev")));
  }

  divider();
}
