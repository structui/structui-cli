"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJson = getPackageJson;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
let cachedPackageJson = null;
async function getPackageJson() {
    if (cachedPackageJson) {
        return cachedPackageJson;
    }
    const packagePath = node_path_1.default.resolve(__dirname, "..", "..", "package.json");
    const raw = await (0, promises_1.readFile)(packagePath, "utf8");
    cachedPackageJson = JSON.parse(raw);
    return cachedPackageJson;
}
