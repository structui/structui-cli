import path from "node:path";
import { loadConfig } from "../core/config";
import { ensureDir, readJsonFile, writeJsonFile } from "../utils/fs";
import { divider, indent, mutedText, section, successText } from "../utils/console";

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
    cachePath: config.cachePath
  });

  await ensureDir(path.join(cwd, path.dirname(config.statePath)));
  await ensureDir(path.join(cwd, path.dirname(config.cachePath)));
  await ensureDir(path.join(cwd, config.installPath));
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
  console.log(indent(`State path: ${config.statePath}`));
  divider();
  console.log(indent(mutedText("Next step: npx sui search")));
}
