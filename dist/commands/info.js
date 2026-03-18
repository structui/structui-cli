"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoCommand = infoCommand;
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const console_1 = require("../utils/console");
async function infoCommand(args) {
    const [name] = args;
    if (!name) {
        throw new Error("Usage: sui info <name>");
    }
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const index = await (0, registry_1.loadRegistryIndex)(config);
    const item = (0, registry_1.findRegistryItem)(index, name);
    if (!item) {
        throw new Error(`Package not found in registry: ${name}`);
    }
    const detail = await (0, registry_1.loadRegistryItem)(config, item);
    (0, console_1.section)("Package Info", `${detail.name} ${(0, console_1.mutedText)(`(${detail.type})`)}`);
    console.log((0, console_1.indent)(`version: ${detail.version}`));
    console.log((0, console_1.indent)(`description: ${detail.description}`));
    console.log((0, console_1.indent)(`files: ${detail.files.length}`));
    console.log((0, console_1.indent)(`dependencies: ${(detail.dependencies ?? item.dependencies).join(", ") || "none"}`));
    console.log((0, console_1.indent)(`tags: ${(detail.tags ?? item.tags ?? []).join(", ") || "none"}`));
    (0, console_1.divider)();
    for (const file of detail.files) {
        console.log((0, console_1.indent)(file.path));
    }
}
