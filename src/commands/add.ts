import { execSync } from "node:child_process";
import path from "node:path";
import prompts from "prompts";
import { loadConfig } from "../core/config";
import { findRegistryItem, loadRegistryIndex, loadRegistryItem } from "../core/registry";
import { saveInstalledPackage } from "../core/state";
import { parseArgs } from "../utils/args";
import { writeTextFile } from "../utils/fs";
import { divider, indent, mutedText, section, successText, warningText } from "../utils/console";
import { CliConfig } from "../core/types";
import { RegistryIndex } from "../core/types";

export async function addCommand(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  let [initialName] = parsed.positionals;

  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);

  if (!initialName) {
    const response = await prompts({
      type: "autocomplete",
      name: "component",
      message: "Which component would you like to add?",
      choices: index.items.map((item) => ({ title: item.name, value: item.name, description: item.description })),
    });

    if (!response.component) {
      console.log(indent(mutedText("Canceled.")));
      return;
    }
    initialName = response.component;
  }

  const installedDeps = new Set<string>();
  const collectedNpmDeps = new Set<string>();

  async function installItem(name: string, isDep: boolean) {
    if (installedDeps.has(name)) return;
    installedDeps.add(name);

    const target = findRegistryItem(index, name);
    if (!target) {
      if (!isDep) throw new Error(`Package not found in registry: ${name}`);
      console.log(indent(warningText(`Dependency not found in registry: ${name}`)));
      return;
    }

    const detail = await loadRegistryItem(config, target);
    const writtenPaths: string[] = [];

    for (const file of detail.files) {
      // Create path dynamically, checking if file.path has a sub-folder or rely on config installPath
      let resolvedPath = path.join(cwd, config.installPath, file.path);
      // Automatically nest blocks under blocks/ or components/ if needed (based on detail.type)
      if (detail.type === "block" && !file.path.startsWith("blocks/")) {
        resolvedPath = path.join(cwd, config.installPath, "blocks", file.path);
      } else if (detail.type === "component" && !file.path.startsWith("ui/")) {
        resolvedPath = path.join(cwd, config.installPath, "ui", file.path);
      }
      await writeTextFile(resolvedPath, file.content + "\\n");
      writtenPaths.push(path.relative(cwd, resolvedPath));
    }

    await saveInstalledPackage(cwd, config, {
      name: detail.name,
      type: detail.type,
      version: detail.version,
      installedAt: new Date().toISOString(),
      targetPaths: writtenPaths,
      source: config.registryUrl,
    });

    if (!isDep) {
      section("Installed", successText(`${detail.name}@${detail.version}`) + mutedText(` (${detail.type})`));
      console.log(indent(detail.description));
      divider();
    } else {
      console.log(indent(successText(`+ ${detail.name}`) + mutedText(` (dependency)`)));
    }

    for (const filePath of writtenPaths) {
      console.log(indent(`  ${filePath}`));
    }

    if (!isDep && detail.type === "block") {
      divider();
      console.log(indent(warningText("Blocks require Struct UI styles to render correctly.")));
      console.log(indent(mutedText("Ensure your <html> element has className=\"dark\" or a theme class.")));
    }

    if (detail.dependencies) {
      for (const dep of detail.dependencies) {
        collectedNpmDeps.add(dep);
      }
    }

    if (detail.registryDependencies && detail.registryDependencies.length > 0) {
      for (const reqDep of detail.registryDependencies) {
        await installItem(reqDep, true);
      }
    }
  }

  await installItem(initialName, false);

  if (collectedNpmDeps.size > 0) {
    divider();
    const npmDepsList = Array.from(collectedNpmDeps);
    console.log(indent(mutedText(`Installing NPM dependencies: ${npmDepsList.join(", ")}...`)));
    try {
      execSync(`npm install ${npmDepsList.join(" ")}`, { stdio: "inherit", cwd });
      console.log(indent(successText("Dependencies installed successfully.")));
    } catch (error) {
      console.log(indent(warningText(`Failed to install NPM dependencies. Run manually: npm i ${npmDepsList.join(" ")}`)));
    }
  }

  divider();
  console.log(indent(mutedText("State saved to .sui/installed.json")));
}
