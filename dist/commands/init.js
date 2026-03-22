"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const node_child_process_1 = require("node:child_process");
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
        cachePath: config.cachePath,
        utilsPath: config.utilsPath
    });
    await (0, fs_1.ensureDir)(node_path_1.default.join(cwd, node_path_1.default.dirname(config.statePath)));
    await (0, fs_1.ensureDir)(node_path_1.default.join(cwd, node_path_1.default.dirname(config.cachePath)));
    await (0, fs_1.ensureDir)(node_path_1.default.join(cwd, config.installPath));
    const fullUtilsPath = node_path_1.default.join(cwd, config.utilsPath);
    await (0, fs_1.ensureDir)(node_path_1.default.dirname(fullUtilsPath));
    const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
    await (0, fs_1.writeTextFile)(fullUtilsPath, utilsContent);
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
    console.log((0, console_1.indent)(`Utils path: ${config.utilsPath}`));
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("Installing dependencies (clsx, tailwind-merge)...")));
    try {
        (0, node_child_process_1.execSync)("npm install clsx tailwind-merge", { stdio: "inherit", cwd });
        console.log((0, console_1.indent)((0, console_1.successText)("Dependencies installed successfully.")));
    }
    catch (error) {
        console.log((0, console_1.indent)((0, console_1.warningText)("Failed to install dependencies. Please run 'npm install clsx tailwind-merge' manually.")));
    }
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("Configuring styles automatically...")));
    try {
        const { styleCommand } = require("./style");
        await styleCommand(["--auto"]);
    }
    catch (err) {
        console.log((0, console_1.indent)((0, console_1.warningText)("Could not auto-configure styles. You may need to run 'npx sui style' manually.")));
    }
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("Next steps:")));
    console.log((0, console_1.indent)((0, console_1.mutedText)("1. Add className=\"dark\" to your <html> element (or use a theme provider)")));
    console.log((0, console_1.indent)((0, console_1.mutedText)("2. Run `npx sui search` to browse components and blocks")));
}
