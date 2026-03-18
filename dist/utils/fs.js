"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
exports.writeTextFile = writeTextFile;
const promises_1 = require("node:fs/promises");
const node_path_1 = __importDefault(require("node:path"));
async function ensureDir(dir) {
    await (0, promises_1.mkdir)(dir, { recursive: true });
}
async function readJsonFile(filePath) {
    try {
        const raw = await (0, promises_1.readFile)(filePath, "utf8");
        return JSON.parse(raw);
    }
    catch (error) {
        const typedError = error;
        if (typedError.code === "ENOENT") {
            return null;
        }
        throw new Error(`Failed to read JSON file: ${filePath}`);
    }
}
async function writeJsonFile(filePath, value) {
    await ensureDir(node_path_1.default.dirname(filePath));
    await (0, promises_1.writeFile)(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}
async function writeTextFile(filePath, value) {
    await ensureDir(node_path_1.default.dirname(filePath));
    await (0, promises_1.writeFile)(filePath, value, "utf8");
}
