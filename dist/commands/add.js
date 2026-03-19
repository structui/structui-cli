"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = addCommand;
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const prompts_1 = __importDefault(require("prompts"));
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const state_1 = require("../core/state");
const args_1 = require("../utils/args");
const fs_1 = require("../utils/fs");
const console_1 = require("../utils/console");
async function addCommand(args) {
    const parsed = (0, args_1.parseArgs)(args);
    let [name] = parsed.positionals;
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const index = await (0, registry_1.loadRegistryIndex)(config);
    if (!name) {
        const response = await (0, prompts_1.default)({
            type: "autocomplete",
            name: "component",
            message: "Which component would you like to add?",
            choices: index.items.map((item) => ({ title: item.name, value: item.name, description: item.description })),
        });
        if (!response.component) {
            console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
            return;
        }
        name = response.component;
    }
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
    (0, console_1.section)("Installed", (0, console_1.successText)(`${detail.name}@${detail.version}`) + (0, console_1.mutedText)(` (${detail.type})`));
    console.log((0, console_1.indent)(detail.description));
    (0, console_1.divider)();
    for (const filePath of writtenPaths) {
        console.log((0, console_1.indent)(filePath));
    }
    if (detail.type === "block") {
        (0, console_1.divider)();
        console.log((0, console_1.indent)((0, console_1.warningText)("Blocks require Struct UI styles to render correctly.")));
        console.log((0, console_1.indent)((0, console_1.mutedText)("If you haven't already, run: npx sui style")));
        console.log((0, console_1.indent)((0, console_1.mutedText)("Also ensure your <html> element has className=\"dark\" or a theme class.")));
    }
    if (target.dependencies.length > 0) {
        (0, console_1.divider)();
        console.log((0, console_1.indent)((0, console_1.mutedText)(`Installing dependencies: ${target.dependencies.join(", ")}...`)));
        try {
            (0, node_child_process_1.execSync)(`npm install ${target.dependencies.join(" ")}`, { stdio: "inherit", cwd });
            console.log((0, console_1.indent)((0, console_1.successText)("Dependencies installed successfully.")));
        }
        catch (error) {
            console.log((0, console_1.indent)((0, console_1.warningText)(`Failed to install dependencies: ${target.dependencies.join(", ")}`)));
        }
    }
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("State saved to .sui/installed.json")));
}
