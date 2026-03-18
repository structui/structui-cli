import { loadConfig } from "../core/config";
import { loadRegistryIndex } from "../core/registry";
import { readInstalledState } from "../core/state";
import { compareVersions } from "../utils/semver";
import { divider, indent, mutedText, section, successText, warningText } from "../utils/console";
import { formatDateTime } from "../utils/time";

export async function listCommand(): Promise<void> {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const [state, index] = await Promise.all([
    readInstalledState(cwd, config),
    loadRegistryIndex(config, { preferCache: true })
  ]);

  section("Installed Packages");

  if (state.packages.length === 0) {
    console.log(indent(mutedText("No packages installed yet.")));
    console.log(indent(mutedText("Run `sui add <name>` to install one.")));
    return;
  }

  divider();
  for (const pkg of state.packages) {
    const registryItem = index.items.find((item) => item.name === pkg.name);
    const isOutdated = registryItem ? compareVersions(registryItem.version, pkg.version) > 0 : false;
    const versionLabel = isOutdated
      ? `${warningText(pkg.version)} -> ${successText(registryItem?.version ?? "unknown")}`
      : successText(pkg.version);

    console.log(indent(`${pkg.name} ${mutedText(`(${pkg.type})`)}`));
    console.log(indent(`version: ${versionLabel}`, 4));
    console.log(indent(`installed: ${formatDateTime(pkg.installedAt)}`, 4));
    console.log(indent(`files: ${pkg.targetPaths.join(", ")}`, 4));
    console.log(indent(`source: ${pkg.source}`, 4));
    divider();
  }
}
