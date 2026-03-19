"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommand = setupCommand;
const node_child_process_1 = require("node:child_process");
const node_https_1 = __importDefault(require("node:https"));
const node_http_1 = __importDefault(require("node:http"));
const node_path_1 = __importDefault(require("node:path"));
const prompts_1 = __importDefault(require("prompts"));
const config_1 = require("../core/config");
const fs_1 = require("../utils/fs");
const console_1 = require("../utils/console");
// ─── Fallback static list (used if API is unreachable) ───────────────────────
const FALLBACK_SETUPS = [
    { name: "crm", label: "CRM", icon: "👥", description: "Sign-in/up, dashboard, customers, deals, activities, reports.", pages: ["Dashboard", "Customers", "Deals", "Activities", "Reports", "Profile"], installCommand: "npx sui add crm-setup" },
    { name: "erp", label: "ERP", icon: "🏭", description: "Dashboard, inventory, orders, procurement, finance, HR, reports.", pages: ["Dashboard", "Inventory", "Orders", "Finance", "HR", "Reports", "Profile"], installCommand: "npx sui add erp-setup" },
    { name: "saas", label: "SaaS", icon: "🚀", description: "Landing page, dashboard, analytics, users, billing, settings.", pages: ["Landing", "Dashboard", "Analytics", "Users", "Billing", "Settings", "Profile"], installCommand: "npx sui add saas-setup" },
    { name: "auth", label: "Auth", icon: "🔐", description: "Sign-in, sign-up, forgot password and a protected home page.", pages: ["Sign In", "Sign Up", "Forgot Password", "Protected Home"], installCommand: "npx sui add auth-setup" },
];
const SETUP_ALIASES = {
    "crm-setup": "crm", "erp-setup": "erp", "saas-setup": "saas",
    "auth-setup": "auth", "auth-only": "auth",
};
const COLOR_CHOICES = [
    { title: "Slate", value: "slate", description: "Neutral cool gray" },
    { title: "Blue", value: "blue", description: "Classic blue" },
    { title: "Indigo", value: "indigo", description: "Deep indigo" },
    { title: "Violet", value: "violet", description: "Soft violet" },
    { title: "Purple", value: "purple", description: "Rich purple" },
    { title: "Rose", value: "rose", description: "Warm rose" },
    { title: "Orange", value: "orange", description: "Vibrant orange" },
    { title: "Emerald", value: "emerald", description: "Fresh emerald" },
    { title: "Teal", value: "teal", description: "Calm teal" },
    { title: "Zinc", value: "zinc", description: "Warm gray" },
];
const AUTH_CHOICES = [
    { title: "None", value: "none", description: "Skip — add it yourself later" },
    { title: "NextAuth.js", value: "next-auth", description: "next-auth v5 beta, Credentials provider" },
    { title: "Better Auth", value: "better-auth", description: "better-auth — modern, database-agnostic" },
    { title: "Basic Auth (JWT)", value: "basic-auth", description: "Custom JWT cookies — no third-party dependency" },
];
// ─── HTTP fetch helper ────────────────────────────────────────────────────────
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith("https") ? node_https_1.default : node_http_1.default;
        const req = lib.get(url, (res) => {
            let body = "";
            res.on("data", (chunk) => { body += chunk.toString(); });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch {
                    reject(new Error("Failed to parse JSON response"));
                }
            });
        });
        req.on("error", reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error("Request timed out")); });
    });
}
function getBaseUrl(registryUrl) {
    try {
        const u = new URL(registryUrl);
        return `${u.protocol}//${u.host}`;
    }
    catch {
        return "https://structui.com";
    }
}
// ─── Main Command ─────────────────────────────────────────────────────────────
async function setupCommand(args) {
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const baseUrl = getBaseUrl(config.registryUrl);
    console.log();
    console.log((0, console_1.titleText)("  Struct UI — Setup Generator"));
    console.log((0, console_1.indent)((0, console_1.mutedText)("Scaffold a production-ready Next.js app in seconds."), 2));
    console.log();
    // 1. Fetch available setups from StructUI API ───────────────────────────────
    let setupEntries = FALLBACK_SETUPS;
    try {
        const index = await fetchJson(`${baseUrl}/api/setups/index.json`);
        if (Array.isArray(index.setups) && index.setups.length > 0) {
            setupEntries = index.setups;
        }
    }
    catch {
        console.log((0, console_1.indent)((0, console_1.mutedText)("(Using offline setup list — could not reach registry)")));
    }
    // 2. Resolve setup type ────────────────────────────────────────────────────
    const rawArg = args[0]?.toLowerCase().trim() ?? "";
    let setupName = rawArg
        ? (SETUP_ALIASES[rawArg] ?? (setupEntries.find((s) => s.name === rawArg)?.name ?? null))
        : null;
    if (!setupName) {
        if (rawArg) {
            console.log((0, console_1.indent)((0, console_1.warningText)(`Unknown setup: "${rawArg}". Please choose from the list below.`)));
            console.log();
        }
        const res = await (0, prompts_1.default)({
            type: "select",
            name: "type",
            message: "Which setup would you like to scaffold?",
            choices: setupEntries.map((s) => ({
                title: `${s.icon}  ${s.label}`,
                value: s.name,
                description: s.description,
            })),
        });
        if (!res.type) {
            console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
            return;
        }
        setupName = res.type;
    }
    const chosenSetup = setupEntries.find((s) => s.name === setupName);
    if (!chosenSetup)
        throw new Error(`Setup not found: ${setupName}`);
    // 3. Project title ─────────────────────────────────────────────────────────
    const titleRes = await (0, prompts_1.default)({
        type: "text",
        name: "title",
        message: "Project title?",
        initial: `${chosenSetup.label} App`,
        validate: (v) => v.trim().length > 0 || "Title cannot be empty",
    });
    if (!titleRes.title) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
        return;
    }
    const projectTitle = titleRes.title.trim();
    // 4. Color palette ─────────────────────────────────────────────────────────
    const colorRes = await (0, prompts_1.default)({
        type: "select",
        name: "color",
        message: "Primary color palette?",
        choices: COLOR_CHOICES,
        initial: 1, // blue
    });
    if (!colorRes.color) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
        return;
    }
    const colorPalette = colorRes.color;
    // 5. Auth provider ─────────────────────────────────────────────────────────
    const authRes = await (0, prompts_1.default)({
        type: "select",
        name: "provider",
        message: "Authentication provider?",
        choices: AUTH_CHOICES,
    });
    if (authRes.provider === undefined) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
        return;
    }
    const authProvider = authRes.provider;
    // 6. Output location ───────────────────────────────────────────────────────
    const locationRes = await (0, prompts_1.default)({
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
    if (!locationRes.location) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
        return;
    }
    const outputToMain = locationRes.location === "main";
    const basePath = outputToMain ? cwd : node_path_1.default.join(cwd, "struct", "setups", setupName);
    // 7. Confirm ───────────────────────────────────────────────────────────────
    console.log();
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.titleText)("Summary")));
    console.log((0, console_1.indent)(`Setup     ${(0, console_1.accentText)(chosenSetup.label)}`));
    console.log((0, console_1.indent)(`Title     ${(0, console_1.accentText)(projectTitle)}`));
    console.log((0, console_1.indent)(`Color     ${(0, console_1.accentText)(colorPalette)}`));
    console.log((0, console_1.indent)(`Auth      ${(0, console_1.accentText)(authProvider)}`));
    console.log((0, console_1.indent)(`Output    ${(0, console_1.accentText)(outputToMain ? "Current directory" : `struct/setups/${setupName}`)}`));
    (0, console_1.divider)();
    console.log();
    const confirmRes = await (0, prompts_1.default)({ type: "confirm", name: "ok", message: "Generate setup?", initial: true });
    if (!confirmRes.ok) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
        return;
    }
    // 8. Fetch generated files from StructUI API ───────────────────────────────
    console.log();
    (0, console_1.section)("Fetching files from registry…");
    console.log();
    const params = new URLSearchParams({
        title: projectTitle,
        color: colorPalette,
        auth: authProvider,
    });
    let detail;
    try {
        detail = await fetchJson(`${baseUrl}/api/setups/${setupName}?${params}`);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        throw new Error(`Failed to fetch setup files from registry: ${msg}\n  URL: ${baseUrl}/api/setups/${setupName}`);
    }
    if (!Array.isArray(detail.files) || detail.files.length === 0) {
        throw new Error("Registry returned an empty file list.");
    }
    // 9. Write files ───────────────────────────────────────────────────────────
    for (const file of detail.files) {
        const fullPath = node_path_1.default.join(basePath, file.path);
        await (0, fs_1.writeTextFile)(fullPath, file.content);
        console.log((0, console_1.indent)((0, console_1.successText)("✓") + "  " + (0, console_1.mutedText)(file.path)));
    }
    // 10. Install dependencies ─────────────────────────────────────────────────
    if (outputToMain && detail.dependencies.length > 0) {
        console.log();
        (0, console_1.divider)();
        console.log((0, console_1.indent)((0, console_1.mutedText)(`Installing: ${detail.dependencies.join(", ")}…`)));
        try {
            (0, node_child_process_1.execSync)(`npm install ${detail.dependencies.join(" ")}`, { stdio: "inherit", cwd });
            console.log((0, console_1.indent)((0, console_1.successText)("Dependencies installed.")));
        }
        catch {
            console.log((0, console_1.indent)((0, console_1.warningText)(`Run manually: npm install ${detail.dependencies.join(" ")}`)));
        }
    }
    // 11. Done ─────────────────────────────────────────────────────────────────
    console.log();
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.successText)(`✓  ${chosenSetup.label} setup generated  (${detail.files.length} files)`)));
    console.log();
    if (!outputToMain) {
        console.log((0, console_1.indent)((0, console_1.mutedText)(`Saved to: struct/setups/${setupName}/`)));
        console.log((0, console_1.indent)((0, console_1.mutedText)("Copy into your project when ready.")));
        console.log();
    }
    if (detail.instructions && detail.instructions.length > 0) {
        console.log((0, console_1.indent)((0, console_1.titleText)("Next steps:")));
        detail.instructions.forEach((step, i) => {
            console.log((0, console_1.indent)(`${i + 1}. ${(0, console_1.mutedText)(step)}`));
        });
        console.log();
    }
    if (outputToMain) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Run: npm run dev")));
    }
    (0, console_1.divider)();
}
