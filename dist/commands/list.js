"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const state_1 = require("../core/state");
const semver_1 = require("../utils/semver");
const console_1 = require("../utils/console");
const time_1 = require("../utils/time");
async function listCommand() {
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const [state, index] = await Promise.all([
        (0, state_1.readInstalledState)(cwd, config),
        (0, registry_1.loadRegistryIndex)(config, { preferCache: true })
    ]);
    (0, console_1.section)("Installed Packages");
    if (state.packages.length === 0) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("No packages installed yet.")));
        console.log((0, console_1.indent)((0, console_1.mutedText)("Run `sui add <name>` to install one.")));
        return;
    }
    (0, console_1.divider)();
    for (const pkg of state.packages) {
        const registryItem = index.items.find((item) => item.name === pkg.name);
        const isOutdated = registryItem ? (0, semver_1.compareVersions)(registryItem.version, pkg.version) > 0 : false;
        const versionLabel = isOutdated
            ? `${(0, console_1.warningText)(pkg.version)} -> ${(0, console_1.successText)(registryItem?.version ?? "unknown")}`
            : (0, console_1.successText)(pkg.version);
        console.log((0, console_1.indent)(`${pkg.name} ${(0, console_1.mutedText)(`(${pkg.type})`)}`));
        console.log((0, console_1.indent)(`version: ${versionLabel}`, 4));
        console.log((0, console_1.indent)(`installed: ${(0, time_1.formatDateTime)(pkg.installedAt)}`, 4));
        console.log((0, console_1.indent)(`files: ${pkg.targetPaths.join(", ")}`, 4));
        console.log((0, console_1.indent)(`source: ${pkg.source}`, 4));
        (0, console_1.divider)();
    }
}
