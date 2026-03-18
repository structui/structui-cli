"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = addCommand;
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const state_1 = require("../core/state");
const args_1 = require("../utils/args");
const fs_1 = require("../utils/fs");
const console_1 = require("../utils/console");
async function addCommand(args) {
    const parsed = (0, args_1.parseArgs)(args);
    const [name] = parsed.positionals;
    if (!name) {
        throw new Error("Usage: sui add <name>");
    }
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const index = await (0, registry_1.loadRegistryIndex)(config);
    const target = (0, registry_1.findRegistryItem)(index, name);
    if (!target) {
        throw new Error(`Package not found in registry: ${name}`);
    }
    const detail = await (0, registry_1.loadRegistryItem)(config, target);
    const writtenPaths = [];
    for (const file of detail.files) {
        const targetPath = node_path_1.default.join(cwd, config.installPath, file.path);
        await (0, fs_1.writeTextFile)(targetPath, file.content + "\n");
        writtenPaths.push(node_path_1.default.relative(cwd, targetPath));
    }
    await (0, state_1.saveInstalledPackage)(cwd, config, {
        name: detail.name,
        type: detail.type,
        version: detail.version,
        installedAt: new Date().toISOString(),
        targetPaths: writtenPaths,
        source: config.registryUrl
    });
    (0, console_1.section)("Installed", (0, console_1.successText)(`${detail.name}@${detail.version}`));
    console.log((0, console_1.indent)(detail.description));
    (0, console_1.divider)();
    for (const filePath of writtenPaths) {
        console.log((0, console_1.indent)(filePath));
    }
    if (target.dependencies.length > 0) {
        (0, console_1.divider)();
        console.log((0, console_1.indent)((0, console_1.warningText)(`Dependencies declared: ${target.dependencies.join(", ")}`)));
    }
    console.log((0, console_1.indent)((0, console_1.mutedText)("State saved to .sui/installed.json")));
}
