"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = parseArgs;
exports.getFlagValue = getFlagValue;
exports.hasFlag = hasFlag;
function parseArgs(args) {
    const positionals = [];
    const flags = new Map();
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (!arg.startsWith("-")) {
            positionals.push(arg);
            continue;
        }
        if (arg.includes("=")) {
            const [key, value] = arg.split(/=(.*)/s, 2);
            flags.set(key, value);
            continue;
        }
        const next = args[index + 1];
        if (next && !next.startsWith("-")) {
            flags.set(arg, next);
            index += 1;
            continue;
        }
        flags.set(arg, true);
    }
    return { positionals, flags };
}
function getFlagValue(parsed, ...names) {
    for (const name of names) {
        const value = parsed.flags.get(name);
        if (typeof value === "string") {
            return value;
        }
    }
    return undefined;
}
function hasFlag(parsed, ...names) {
    return names.some((name) => parsed.flags.has(name));
}
