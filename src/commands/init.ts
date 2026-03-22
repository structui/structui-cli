import { execSync } from "node:child_process";
import path from "node:path";
import { loadConfig } from "../core/config";
import { ensureDir, readJsonFile, writeJsonFile, writeTextFile } from "../utils/fs";
import { divider, indent, mutedText, section, successText, warningText } from "../utils/console";

type PackageJson = {
  scripts?: Record<string, string>;
};

export async function initCommand(): Promise<void> {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const configPath = path.join(cwd, "sui.config.json");
  const packageJsonPath = path.join(cwd, "package.json");
  const existingPackageJson = await readJsonFile<PackageJson>(packageJsonPath);

  await writeJsonFile(configPath, {
    registryUrl: config.registryUrl,
    installPath: config.installPath,
    statePath: config.statePath,
    cachePath: config.cachePath,
    utilsPath: config.utilsPath
  });

  await ensureDir(path.join(cwd, path.dirname(config.statePath)));
  await ensureDir(path.join(cwd, path.dirname(config.cachePath)));
  await ensureDir(path.join(cwd, config.installPath));
  
  const fullUtilsPath = path.join(cwd, config.utilsPath);
  await ensureDir(path.dirname(fullUtilsPath));

  const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  await writeTextFile(fullUtilsPath, utilsContent);

  await writeJsonFile(path.join(cwd, config.statePath), { packages: [] });

  const packageJson = existingPackageJson ?? {};
  packageJson.scripts = {
    ...packageJson.scripts,
    "struct:list": "sui list",
    "struct:update": "sui update"
  };

  await writeJsonFile(packageJsonPath, packageJson);

  section("Initialized", successText("Struct UI CLI is ready."));
  console.log(indent("Created sui.config.json"));
  console.log(indent(`Install path: ${config.installPath}`));
  console.log(indent(`Utils path: ${config.utilsPath}`));
  divider();

  console.log(indent(mutedText("Installing dependencies (clsx, tailwind-merge)...")));
  try {
    execSync("npm install clsx tailwind-merge", { stdio: "inherit", cwd });
    console.log(indent(successText("Dependencies installed successfully.")));
  } catch (error) {
    console.log(indent(warningText("Failed to install dependencies. Please run 'npm install clsx tailwind-merge' manually.")));
  }

  divider();
  console.log(indent(mutedText("Configuring styles automatically...")));
  try {
    const { styleCommand } = require("./style");
    await styleCommand(["--auto"]);
  } catch (err) {
    console.log(indent(warningText("Could not auto-configure styles. You may need to run 'npx sui style' manually.")));
  }

  divider();
  console.log(indent(mutedText("Next steps:")));
  console.log(indent(mutedText("1. Add className=\"dark\" to your <html> element (or use a theme provider)")));
  console.log(indent(mutedText("2. Run `npx sui search` to browse components and blocks")));
}
