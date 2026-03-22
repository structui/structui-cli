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
    let [initialName] = parsed.positionals;
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const index = await (0, registry_1.loadRegistryIndex)(config);
    if (!initialName) {
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
        initialName = response.component;
    }
    const installedDeps = new Set();
    const collectedNpmDeps = new Set();
    async function installItem(name, isDep) {
        if (installedDeps.has(name))
            return;
        installedDeps.add(name);
        const target = (0, registry_1.findRegistryItem)(index, name);
        if (!target) {
            if (!isDep)
                throw new Error(`Package not found in registry: ${name}`);
            console.log((0, console_1.indent)((0, console_1.warningText)(`Dependency not found in registry: ${name}`)));
            return;
        }
        const detail = await (0, registry_1.loadRegistryItem)(config, target);
        const writtenPaths = [];
        for (const file of detail.files) {
            // Create path dynamically, checking if file.path has a sub-folder or rely on config installPath
            let resolvedPath = node_path_1.default.join(cwd, config.installPath, file.path);
            // Automatically nest blocks under blocks/ or components/ if needed (based on detail.type)
            if (detail.type === "block" && !file.path.startsWith("blocks/")) {
                resolvedPath = node_path_1.default.join(cwd, config.installPath, "blocks", file.path);
            }
            else if (detail.type === "component" && !file.path.startsWith("ui/")) {
                resolvedPath = node_path_1.default.join(cwd, config.installPath, "ui", file.path);
            }
            await (0, fs_1.writeTextFile)(resolvedPath, file.content + "\\n");
            writtenPaths.push(node_path_1.default.relative(cwd, resolvedPath));
        }
        await (0, state_1.saveInstalledPackage)(cwd, config, {
            name: detail.name,
            type: detail.type,
            version: detail.version,
            installedAt: new Date().toISOString(),
            targetPaths: writtenPaths,
            source: config.registryUrl,
        });
        if (!isDep) {
            (0, console_1.section)("Installed", (0, console_1.successText)(`${detail.name}@${detail.version}`) + (0, console_1.mutedText)(` (${detail.type})`));
            console.log((0, console_1.indent)(detail.description));
            (0, console_1.divider)();
        }
        else {
            console.log((0, console_1.indent)((0, console_1.successText)(`+ ${detail.name}`) + (0, console_1.mutedText)(` (dependency)`)));
        }
        for (const filePath of writtenPaths) {
            console.log((0, console_1.indent)(`  ${filePath}`));
        }
        if (!isDep && detail.type === "block") {
            (0, console_1.divider)();
            console.log((0, console_1.indent)((0, console_1.warningText)("Blocks require Struct UI styles to render correctly.")));
            console.log((0, console_1.indent)((0, console_1.mutedText)("Ensure your <html> element has className=\"dark\" or a theme class.")));
        }
        if (detail.dependencies) {
            for (const dep of detail.dependencies) {
                collectedNpmDeps.add(dep);
            }
        }
        if (detail.registryDependencies && detail.registryDependencies.length > 0) {
            for (const reqDep of detail.registryDependencies) {
                await installItem(reqDep, true);
            }
        }
    }
    await installItem(initialName, false);
    if (collectedNpmDeps.size > 0) {
        (0, console_1.divider)();
        const npmDepsList = Array.from(collectedNpmDeps);
        console.log((0, console_1.indent)((0, console_1.mutedText)(`Installing NPM dependencies: ${npmDepsList.join(", ")}...`)));
        try {
            (0, node_child_process_1.execSync)(`npm install ${npmDepsList.join(" ")}`, { stdio: "inherit", cwd });
            console.log((0, console_1.indent)((0, console_1.successText)("Dependencies installed successfully.")));
        }
        catch (error) {
            console.log((0, console_1.indent)((0, console_1.warningText)(`Failed to install NPM dependencies. Run manually: npm i ${npmDepsList.join(" ")}`)));
        }
    }
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("State saved to .sui/installed.json")));
}
