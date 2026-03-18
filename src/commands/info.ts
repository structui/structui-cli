import { loadConfig } from "../core/config";
import { findRegistryItem, loadRegistryIndex, loadRegistryItem } from "../core/registry";
import { divider, indent, mutedText, section } from "../utils/console";

export async function infoCommand(args: string[]): Promise<void> {
  const [name] = args;
  if (!name) {
    throw new Error("Usage: sui info <name>");
  }

  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);
  const item = findRegistryItem(index, name);

  if (!item) {
    throw new Error(`Package not found in registry: ${name}`);
  }

  const detail = await loadRegistryItem(config, item);

  section("Package Info", `${detail.name} ${mutedText(`(${detail.type})`)}`);
  console.log(indent(`version: ${detail.version}`));
  console.log(indent(`description: ${detail.description}`));
  console.log(indent(`files: ${detail.files.length}`));
  console.log(indent(`dependencies: ${(detail.dependencies ?? item.dependencies).join(", ") || "none"}`));
  console.log(indent(`tags: ${(detail.tags ?? item.tags ?? []).join(", ") || "none"}`));
  divider();
  for (const file of detail.files) {
    console.log(indent(file.path));
  }
}
