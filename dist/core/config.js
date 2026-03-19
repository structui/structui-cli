"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = require("../utils/fs");
const DEFAULT_REGISTRY_URL = process.env.SUI_REGISTRY_URL ?? "https://structui.com/api/registry/index.json";
async function loadConfig(cwd) {
    const localConfigPath = node_path_1.default.join(cwd, "sui.config.json");
    const config = (await (0, fs_1.readJsonFile)(localConfigPath)) ?? {};
    return {
        registryUrl: config.registryUrl ?? DEFAULT_REGISTRY_URL,
        installPath: config.installPath ?? "components/struct",
        statePath: config.statePath ?? ".sui/installed.json",
        cachePath: config.cachePath ?? ".sui/cache/registry-index.json",
        utilsPath: config.utilsPath ?? "src/lib/utils.ts"
    };
}
