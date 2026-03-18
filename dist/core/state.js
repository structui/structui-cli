"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInstalledState = readInstalledState;
exports.saveInstalledPackage = saveInstalledPackage;
exports.removeInstalledPackage = removeInstalledPackage;
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = require("../utils/fs");
const EMPTY_STATE = { packages: [] };
async function readInstalledState(cwd, config) {
    return (await (0, fs_1.readJsonFile)(node_path_1.default.join(cwd, config.statePath))) ?? EMPTY_STATE;
}
async function saveInstalledPackage(cwd, config, installedPackage) {
    const statePath = node_path_1.default.join(cwd, config.statePath);
    const state = await readInstalledState(cwd, config);
    const nextPackages = state.packages.filter((item) => item.name !== installedPackage.name);
    nextPackages.push(installedPackage);
    nextPackages.sort((left, right) => left.name.localeCompare(right.name));
    await (0, fs_1.writeJsonFile)(statePath, { packages: nextPackages });
}
async function removeInstalledPackage(cwd, config, packageName) {
    const statePath = node_path_1.default.join(cwd, config.statePath);
    const state = await readInstalledState(cwd, config);
    const nextPackages = state.packages.filter((item) => item.name !== packageName);
    await (0, fs_1.writeJsonFile)(statePath, { packages: nextPackages });
}
