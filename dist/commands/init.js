"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("../core/config");
const fs_1 = require("../utils/fs");
const console_1 = require("../utils/console");
async function initCommand() {
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const configPath = node_path_1.default.join(cwd, "sui.config.json");
    const packageJsonPath = node_path_1.default.join(cwd, "package.json");
    const existingPackageJson = await (0, fs_1.readJsonFile)(packageJsonPath);
    await (0, fs_1.writeJsonFile)(configPath, {
        registryUrl: config.registryUrl,
        installPath: config.installPath,
        statePath: config.statePath,
        cachePath: config.cachePath
    });
    await (0, fs_1.ensureDir)(node_path_1.default.join(cwd, node_path_1.default.dirname(config.statePath)));
    await (0, fs_1.ensureDir)(node_path_1.default.join(cwd, node_path_1.default.dirname(config.cachePath)));
    await (0, fs_1.ensureDir)(node_path_1.default.join(cwd, config.installPath));
    await (0, fs_1.writeJsonFile)(node_path_1.default.join(cwd, config.statePath), { packages: [] });
    const packageJson = existingPackageJson ?? {};
    packageJson.scripts = {
        ...packageJson.scripts,
        "struct:list": "sui list",
        "struct:update": "sui update"
    };
    await (0, fs_1.writeJsonFile)(packageJsonPath, packageJson);
    (0, console_1.section)("Initialized", (0, console_1.successText)("Struct UI CLI is ready."));
    console.log((0, console_1.indent)("Created sui.config.json"));
    console.log((0, console_1.indent)(`Install path: ${config.installPath}`));
    console.log((0, console_1.indent)(`State path: ${config.statePath}`));
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("Next step: npx sui search")));
}
