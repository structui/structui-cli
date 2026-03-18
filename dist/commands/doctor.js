"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorCommand = doctorCommand;
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
const node_fs_1 = require("node:fs");
const config_1 = require("../core/config");
const state_1 = require("../core/state");
const console_1 = require("../utils/console");
async function canAccess(targetPath) {
    try {
        await (0, promises_1.access)(targetPath, node_fs_1.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
async function doctorCommand() {
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const state = await (0, state_1.readInstalledState)(cwd, config);
    const checks = [
        {
            label: "config",
            ok: await canAccess(node_path_1.default.join(cwd, "sui.config.json"))
        },
        {
            label: "install directory",
            ok: await canAccess(node_path_1.default.join(cwd, config.installPath))
        },
        {
            label: "state file",
            ok: await canAccess(node_path_1.default.join(cwd, config.statePath))
        },
        {
            label: "packages installed",
            ok: state.packages.length > 0
        }
    ];
    (0, console_1.section)("Doctor");
    (0, console_1.divider)();
    for (const check of checks) {
        const stateText = check.ok ? (0, console_1.successText)("ok") : (0, console_1.warningText)("missing");
        console.log((0, console_1.indent)(`${check.label}: ${stateText}`));
    }
}
