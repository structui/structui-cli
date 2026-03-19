import { execSync } from "node:child_process";
import path from "node:path";
import prompts from "prompts";
import { loadConfig } from "../core/config";
import { findRegistryItem, loadRegistryIndex, loadRegistryItem } from "../core/registry";
import { saveInstalledPackage } from "../core/state";
import { parseArgs } from "../utils/args";
import { writeTextFile } from "../utils/fs";
import { divider, indent, mutedText, section, successText, warningText } from "../utils/console";

export async function addCommand(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  let [name] = parsed.positionals;

  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);

  if (!name) {
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
    name = response.component;
  }
  const target = findRegistryItem(index, name);

  if (!target) {
    throw new Error(`Package not found in registry: ${name}`);
  }

  const detail = await loadRegistryItem(config, target);
  const writtenPaths: string[] = [];

  for (const file of detail.files) {
    const targetPath = path.join(cwd, config.installPath, file.path);
    await writeTextFile(targetPath, file.content + "\n");
    writtenPaths.push(path.relative(cwd, targetPath));
  }

  await saveInstalledPackage(cwd, config, {
    name: detail.name,
    type: detail.type,
    version: detail.version,
    installedAt: new Date().toISOString(),
    targetPaths: writtenPaths,
    source: config.registryUrl
  });

  section("Installed", successText(`${detail.name}@${detail.version}`) + mutedText(` (${detail.type})`));
  console.log(indent(detail.description));
  divider();
  for (const filePath of writtenPaths) {
    console.log(indent(filePath));
  }

  if (detail.type === "block") {
    divider();
    console.log(indent(warningText("Blocks require Struct UI styles to render correctly.")));
    console.log(indent(mutedText("If you haven't already, run: npx sui style")));
    console.log(indent(mutedText("Also ensure your <html> element has className=\"dark\" or a theme class.")));
  }

  if (target.dependencies.length > 0) {
    divider();
    console.log(indent(mutedText(`Installing dependencies: ${target.dependencies.join(", ")}...`)));
    try {
      execSync(`npm install ${target.dependencies.join(" ")}`, { stdio: "inherit", cwd });
      console.log(indent(successText("Dependencies installed successfully.")));
    } catch (error) {
      console.log(indent(warningText(`Failed to install dependencies: ${target.dependencies.join(", ")}`)));
    }
  }

  divider();
  console.log(indent(mutedText("State saved to .sui/installed.json")));
}
