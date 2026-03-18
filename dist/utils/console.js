"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleText = titleText;
exports.accentText = accentText;
exports.successText = successText;
exports.warningText = warningText;
exports.errorText = errorText;
exports.mutedText = mutedText;
exports.divider = divider;
exports.section = section;
exports.formatCommand = formatCommand;
exports.indent = indent;
const ANSI = {
    reset: "\u001B[0m",
    dim: "\u001B[2m",
    bold: "\u001B[1m",
    red: "\u001B[31m",
    green: "\u001B[32m",
    yellow: "\u001B[33m",
    cyan: "\u001B[36m",
    gray: "\u001B[90m"
};
function colorize(color, value) {
    return `${color}${value}${ANSI.reset}`;
}
function titleText(value) {
    return colorize(ANSI.bold, value);
}
function accentText(value) {
    return colorize(ANSI.cyan, value);
}
function successText(value) {
    return colorize(ANSI.green, value);
}
function warningText(value) {
    return colorize(ANSI.yellow, value);
}
function errorText(value) {
    return colorize(ANSI.red, value);
}
function mutedText(value) {
    return colorize(ANSI.gray, value);
}
function divider() {
    console.log(mutedText("─".repeat(56)));
}
function section(title, body) {
    console.log(titleText(title));
    if (body) {
        console.log(body);
    }
}
function formatCommand(command) {
    return accentText(command);
}
function indent(value, spaces = 2) {
    return `${" ".repeat(spaces)}${value}`;
}
