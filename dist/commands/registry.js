"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registryCommand = registryCommand;
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const console_1 = require("../utils/console");
const time_1 = require("../utils/time");
async function registryCommand() {
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const index = await (0, registry_1.loadRegistryIndex)(config);
    (0, console_1.section)("Registry");
    console.log((0, console_1.indent)(`url: ${config.registryUrl}`));
    console.log((0, console_1.indent)(`packages: ${index.items.length}`));
    console.log((0, console_1.indent)(`registry version: ${index.registryVersion}`));
    console.log((0, console_1.indent)(`updated: ${(0, time_1.formatDateTime)(index.updatedAt)}`));
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)(`cache: ${config.cachePath}`)));
}
