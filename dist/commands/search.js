"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCommand = searchCommand;
const config_1 = require("../core/config");
const registry_1 = require("../core/registry");
const args_1 = require("../utils/args");
const console_1 = require("../utils/console");
async function searchCommand(args) {
    const parsed = (0, args_1.parseArgs)(args);
    const query = parsed.positionals.join(" ").trim() || undefined;
    const cwd = process.cwd();
    const config = await (0, config_1.loadConfig)(cwd);
    const index = await (0, registry_1.loadRegistryIndex)(config);
    const results = (0, registry_1.searchRegistryItems)(index, query);
    (0, console_1.section)("Registry Search", query ? `Query: ${query}` : (0, console_1.mutedText)("Showing all packages"));
    if (results.length === 0) {
        console.log((0, console_1.indent)((0, console_1.mutedText)("No matching packages found.")));
        return;
    }
    (0, console_1.divider)();
    for (const item of results) {
        console.log((0, console_1.indent)(`${item.name} ${(0, console_1.mutedText)(`(${item.type})`)} ${(0, console_1.mutedText)(item.version)}`));
        console.log((0, console_1.indent)(item.description, 4));
        if (item.tags?.length) {
            console.log((0, console_1.indent)(`tags: ${item.tags.join(", ")}`, 4));
        }
        (0, console_1.divider)();
    }
}
