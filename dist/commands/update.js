"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommand = updateCommand;
const add_1 = require("./add");
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const state_1 = require("../core/state");
const semver_1 = require("../utils/semver");
const console_1 = require("../utils/console");
async function updateCommand(args) {
    const [requestedName] = args;
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const [state, index] = await Promise.all([(0, state_1.readInstalledState)(cwd, config), (0, registry_1.loadRegistryIndex)(config)]);
    const outdated = state.packages.filter((pkg) => {
        const registryItem = index.items.find((item) => item.name === pkg.name);
        if (!registryItem) {
            return false;
        }
        if (requestedName && requestedName !== pkg.name) {
            return false;
        }
        return (0, semver_1.compareVersions)(registryItem.version, pkg.version) > 0;
    });
    (0, console_1.section)("Update");
    if (requestedName && !state.packages.some((pkg) => pkg.name === requestedName)) {
        throw new Error(`Package is not installed: ${requestedName}`);
    }
    if (outdated.length === 0) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("Everything is up to date.")));
        return;
    }
    for (const pkg of outdated) {
        await (0, add_1.addCommand)([pkg.name]);
        (0, console_1.divider)();
    }
    console.log((0, console_1.indent)((0, console_1.successText)(`Updated ${outdated.length} package(s).`)));
}
