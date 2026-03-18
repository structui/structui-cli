"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCommand = versionCommand;
const package_1 = require("../utils/package");
const console_1 = require("../utils/console");
async function versionCommand() {
    const pkg = await (0, package_1.getPackageJson)();
    (0, console_1.section)("Version", `${(0, console_1.accentText)(pkg.name)} ${pkg.version}`);
}
