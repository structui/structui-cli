"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVersions = compareVersions;
function normalize(version) {
    return version
        .replace(/^[^\d]*/, "")
        .split(".")
        .map((part) => Number.parseInt(part, 10) || 0);
}
function compareVersions(left, right) {
    const leftParts = normalize(left);
    const rightParts = normalize(right);
    const length = Math.max(leftParts.length, rightParts.length);
    for (let index = 0; index < length; index += 1) {
        const leftValue = leftParts[index] ?? 0;
        const rightValue = rightParts[index] ?? 0;
        if (leftValue > rightValue) {
            return 1;
        }
        if (leftValue < rightValue) {
            return -1;
        }
    }
    return 0;
}
