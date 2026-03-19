"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paletteCommand = paletteCommand;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const prompts_1 = __importDefault(require("prompts"));
const themes_1 = require("../core/themes");
const console_1 = require("../utils/console");
const args_1 = require("../utils/args");
async function paletteCommand(args) {
    const parsed = (0, args_1.parseArgs)(args);
    let [paletteName] = parsed.positionals;
    if (!paletteName) {
        const response = await (0, prompts_1.default)({
            type: "autocomplete",
            name: "palette",
            message: "Which color palette would you like to apply?",
            choices: themes_1.themes.map((t) => ({ title: t.name, value: t.name })),
        });
        if (!response.palette) {
            console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
            return;
        }
        paletteName = response.palette;
    }
    const selectedTheme = themes_1.themes.find(t => t.name === paletteName?.toLowerCase());
    if (!selectedTheme) {
        console.log((0, console_1.indent)((0, console_1.errorText)(`Theme '${paletteName}' not found. Available themes: ${themes_1.themes.map(t => t.name).join(', ')}`)));
        return;
    }
    const cwd = process.cwd();
    const possiblePaths = [
        "app/globals.css",
        "src/app/globals.css",
        "src/globals.css",
        "src/index.css",
        "globals.css",
        "styles/globals.css"
    ];
    let targetPath = possiblePaths.find(p => node_fs_1.default.existsSync(node_path_1.default.join(cwd, p)));
    if (!targetPath) {
        const response = await (0, prompts_1.default)({
            type: "text",
            name: "path",
            message: "Where is your global CSS file located? (e.g. app/globals.css)",
            initial: "app/globals.css"
        });
        if (!response.path) {
            console.log((0, console_1.indent)((0, console_1.mutedText)("Canceled.")));
            return;
        }
        targetPath = response.path;
    }
    const finalPath = targetPath;
    const absolutePath = node_path_1.default.join(cwd, finalPath);
    if (!node_fs_1.default.existsSync(absolutePath)) {
        console.log((0, console_1.indent)((0, console_1.errorText)(`File not found: ${finalPath}`)));
        return;
    }
    let cssContent = node_fs_1.default.readFileSync(absolutePath, "utf-8");
    const themeRegex = /@layer base\s*\{\s*:root\s*\{[\s\S]*?\.dark\s*\{[\s\S]*?\}\s*\}/;
    const newThemeBlock = (0, themes_1.generateThemeCssBlock)(selectedTheme);
    if (themeRegex.test(cssContent)) {
        cssContent = cssContent.replace(themeRegex, newThemeBlock);
    }
    else {
        cssContent = cssContent + "\n\n" + newThemeBlock + "\n";
    }
    node_fs_1.default.writeFileSync(absolutePath, cssContent);
    (0, console_1.section)("Palette Applied", (0, console_1.successText)(`Theme '${selectedTheme.name}' successfully applied to ${finalPath}!`));
    (0, console_1.divider)();
}
