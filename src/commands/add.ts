import path from "node:path";
import { loadConfig } from "../core/config";
import { findRegistryItem, loadRegistryIndex, loadRegistryItem } from "../core/registry";
import { saveInstalledPackage } from "../core/state";
import { parseArgs } from "../utils/args";
import { writeTextFile } from "../utils/fs";
import { divider, indent, mutedText, section, successText, warningText } from "../utils/console";

export async function addCommand(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  const [name] = parsed.positionals;
  if (!name) {
    throw new Error("Usage: sui add <name>");
  }

  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);
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

  section("Installed", successText(`${detail.name}@${detail.version}`));
  console.log(indent(detail.description));
  divider();
  for (const filePath of writtenPaths) {
    console.log(indent(filePath));
  }

  if (target.dependencies.length > 0) {
    divider();
    console.log(indent(warningText(`Dependencies declared: ${target.dependencies.join(", ")}`)));
  }

  console.log(indent(mutedText("State saved to .sui/installed.json")));
}
