import { addCommand } from "./add";
import { loadConfig } from "../core/config";
import { loadRegistryIndex } from "../core/registry";
import { readInstalledState } from "../core/state";
import { compareVersions } from "../utils/semver";
import { divider, indent, mutedText, section, successText } from "../utils/console";

export async function updateCommand(args: string[]): Promise<void> {
  const [requestedName] = args;
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const [state, index] = await Promise.all([readInstalledState(cwd, config), loadRegistryIndex(config)]);

  const outdated = state.packages.filter((pkg) => {
    const registryItem = index.items.find((item) => item.name === pkg.name);
    if (!registryItem) {
      return false;
    }

    if (requestedName && requestedName !== pkg.name) {
      return false;
    }

    return compareVersions(registryItem.version, pkg.version) > 0;
  });

  section("Update");

  if (requestedName && !state.packages.some((pkg) => pkg.name === requestedName)) {
    throw new Error(`Package is not installed: ${requestedName}`);
  }

  if (outdated.length === 0) {
    console.log(indent(mutedText("Everything is up to date.")));
    return;
  }

  for (const pkg of outdated) {
    await addCommand([pkg.name]);
    divider();
  }

  console.log(indent(successText(`Updated ${outdated.length} package(s).`)));
}
