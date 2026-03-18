"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpCommand = helpCommand;
const console_1 = require("../utils/console");
async function helpCommand(_args = []) {
    (0, console_1.section)("Struct UI CLI", (0, console_1.mutedText)("Minimal package installer for Struct UI blocks and components."));
    (0, console_1.divider)();
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui init")} Create config and local Struct UI directories`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui add <name>")} Install a block or component`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui search [query]")} Search registry packages`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui info <name>")} Show package details`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui list")} Show installed packages and status`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui update [name]")} Update one package or everything outdated`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui registry")} Show registry metadata`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui doctor")} Validate local setup`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui version")} Show CLI version`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui about")} Project links and metadata`));
    console.log((0, console_1.indent)(`${(0, console_1.formatCommand)("sui help")} Show command help`));
    (0, console_1.divider)();
    console.log((0, console_1.indent)("Config file: sui.config.json"));
    console.log((0, console_1.indent)("Env override: SUI_REGISTRY_URL"));
}
