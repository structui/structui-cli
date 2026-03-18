import { loadConfig } from "../core/config";
import { loadRegistryIndex } from "../core/registry";
import { divider, indent, mutedText, section } from "../utils/console";
import { formatDateTime } from "../utils/time";

export async function registryCommand(): Promise<void> {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);

  section("Registry");
  console.log(indent(`url: ${config.registryUrl}`));
  console.log(indent(`packages: ${index.items.length}`));
  console.log(indent(`registry version: ${index.registryVersion}`));
  console.log(indent(`updated: ${formatDateTime(index.updatedAt)}`));
  divider();
  console.log(indent(mutedText(`cache: ${config.cachePath}`)));
}
