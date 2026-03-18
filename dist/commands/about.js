"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aboutCommand = aboutCommand;
const console_1 = require("../utils/console");
async function aboutCommand() {
    (0, console_1.section)("About", "Struct UI CLI");
    console.log((0, console_1.indent)("Website: https://structui.com"));
    console.log((0, console_1.indent)("GitHub: https://github.com/structui"));
    console.log((0, console_1.indent)("Purpose: install and manage Struct UI blocks/components"));
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("Built for a simple npx-first workflow.")));
}
