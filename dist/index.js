"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const add_1 = require("./commands/add");
const about_1 = require("./commands/about");
const doctor_1 = require("./commands/doctor");
const help_1 = require("./commands/help");
const info_1 = require("./commands/info");
const init_1 = require("./commands/init");
const list_1 = require("./commands/list");
const registry_1 = require("./commands/registry");
const search_1 = require("./commands/search");
const setup_1 = require("./commands/setup");
const update_1 = require("./commands/update");
const version_1 = require("./commands/version");
const style_1 = require("./commands/style");
const palette_1 = require("./commands/palette");
const console_1 = require("./utils/console");
const commands = new Map([
    ["init", init_1.initCommand],
    ["add", add_1.addCommand],
    ["setup", setup_1.setupCommand],
    ["style", style_1.styleCommand],
    ["palette", palette_1.paletteCommand],
    ["search", search_1.searchCommand],
    ["info", info_1.infoCommand],
    ["list", list_1.listCommand],
    ["update", update_1.updateCommand],
    ["registry", registry_1.registryCommand],
    ["doctor", doctor_1.doctorCommand],
    ["version", version_1.versionCommand],
    ["about", about_1.aboutCommand],
    ["help", help_1.helpCommand],
    ["--help", help_1.helpCommand],
    ["-h", help_1.helpCommand],
    ["--version", version_1.versionCommand],
    ["-v", version_1.versionCommand]
]);
async function run(args) {
    const [command = "help", ...rest] = args;
    const handler = commands.get(command);
    if (!handler) {
        console.error((0, console_1.errorText)(`Unknown command: ${command}`));
        await (0, help_1.helpCommand)([]);
        process.exitCode = 1;
        return;
    }
    try {
        await handler(rest);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error((0, console_1.errorText)(message));
        process.exitCode = 1;
    }
}
