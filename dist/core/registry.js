"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRegistryIndex = loadRegistryIndex;
exports.loadRegistryItem = loadRegistryItem;
exports.findRegistryItem = findRegistryItem;
exports.searchRegistryItems = searchRegistryItems;
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = require("../utils/fs");
const LOCAL_FALLBACK_INDEX = {
    registryVersion: 1,
    updatedAt: "2026-03-17T00:00:00.000Z",
    items: [
        {
            name: "hero-banner",
            type: "block",
            version: "1.0.0",
            description: "Starter hero block for marketing pages.",
            entrypoint: "__local__/hero-banner",
            dependencies: [],
            tags: ["marketing", "landing", "hero"]
        },
        {
            name: "feature-grid",
            type: "component",
            version: "1.0.0",
            description: "Simple feature grid section.",
            entrypoint: "__local__/feature-grid",
            dependencies: [],
            tags: ["grid", "features", "content"]
        }
    ]
};
const LOCAL_FALLBACK_DETAILS = {
    "__local__/hero-banner": {
        name: "hero-banner",
        type: "block",
        version: "1.0.0",
        description: "Starter hero block for marketing pages.",
        dependencies: [],
        tags: ["marketing", "landing", "hero"],
        files: [
            {
                path: "hero-banner.tsx",
                content: [
                    "export function HeroBanner() {",
                    "  return (",
                    "    <section className=\"rounded-3xl border border-neutral-200 bg-white px-8 py-16 shadow-sm\">",
                    "      <div className=\"mx-auto max-w-3xl text-center\">",
                    "        <p className=\"text-sm font-medium uppercase tracking-[0.24em] text-neutral-500\">Struct UI</p>",
                    "        <h1 className=\"mt-4 text-4xl font-semibold tracking-tight text-neutral-950\">Build crisp interfaces faster.</h1>",
                    "        <p className=\"mt-4 text-base leading-7 text-neutral-600\">A clean starter block installed by the Struct UI CLI.</p>",
                    "      </div>",
                    "    </section>",
                    "  );",
                    "}"
                ].join("\n")
            }
        ]
    },
    "__local__/feature-grid": {
        name: "feature-grid",
        type: "component",
        version: "1.0.0",
        description: "Simple feature grid section.",
        dependencies: [],
        tags: ["grid", "features", "content"],
        files: [
            {
                path: "feature-grid.tsx",
                content: [
                    "const features = [",
                    "  { title: \"Minimal\", description: \"Designed to stay out of the way.\" },",
                    "  { title: \"Fast\", description: \"Small CLI surface and direct file output.\" },",
                    "  { title: \"Composable\", description: \"Ready to extend into your own registry.\" }",
                    "];",
                    "",
                    "export function FeatureGrid() {",
                    "  return (",
                    "    <div className=\"grid gap-4 md:grid-cols-3\">",
                    "      {features.map((feature) => (",
                    "        <article key={feature.title} className=\"rounded-2xl border border-neutral-200 bg-neutral-50 p-6\">",
                    "          <h3 className=\"text-lg font-medium text-neutral-950\">{feature.title}</h3>",
                    "          <p className=\"mt-2 text-sm leading-6 text-neutral-600\">{feature.description}</p>",
                    "        </article>",
                    "      ))}",
                    "    </div>",
                    "  );",
                    "}"
                ].join("\n")
            }
        ]
    }
};
async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Registry request failed: ${response.status} ${response.statusText}`);
    }
    return (await response.json());
}
function resolveRegistryUrl(baseUrl, entrypoint) {
    if (entrypoint.startsWith("http://") || entrypoint.startsWith("https://")) {
        return entrypoint;
    }
    const normalizedBase = baseUrl.endsWith("/")
        ? baseUrl
        : `${baseUrl.substring(0, baseUrl.lastIndexOf("/") + 1)}`;
    return new URL(entrypoint, normalizedBase).toString();
}
function resolveRegistryFilePath(config, entrypoint) {
    const basePath = config.registryUrl.replace("file://", "");
    if (!entrypoint) {
        return basePath;
    }
    return node_path_1.default.resolve(node_path_1.default.dirname(basePath), entrypoint);
}
async function readCachedIndex(config) {
    return (0, fs_1.readJsonFile)(config.cachePath);
}
async function writeCachedIndex(config, index) {
    await (0, fs_1.writeJsonFile)(config.cachePath, index);
}
async function loadRegistryIndex(config, options = {}) {
    if (options.preferCache) {
        const cached = await readCachedIndex(config);
        if (cached) {
            return cached;
        }
    }
    if (config.registryUrl.startsWith("file://")) {
        const filePath = resolveRegistryFilePath(config);
        const local = await (0, fs_1.readJsonFile)(filePath);
        if (!local) {
            throw new Error(`Registry file not found: ${filePath}`);
        }
        return local;
    }
    try {
        const index = await fetchJson(config.registryUrl);
        await writeCachedIndex(config, index);
        return index;
    }
    catch {
        const cached = await readCachedIndex(config);
        if (cached) {
            return cached;
        }
        return LOCAL_FALLBACK_INDEX;
    }
}
async function loadRegistryItem(config, item) {
    if (item.entrypoint in LOCAL_FALLBACK_DETAILS) {
        return LOCAL_FALLBACK_DETAILS[item.entrypoint];
    }
    if (config.registryUrl.startsWith("file://")) {
        const filePath = resolveRegistryFilePath(config, item.entrypoint);
        const local = await (0, fs_1.readJsonFile)(filePath);
        if (!local) {
            throw new Error(`Registry item file not found: ${filePath}`);
        }
        return local;
    }
    const url = resolveRegistryUrl(config.registryUrl, item.entrypoint);
    return fetchJson(url);
}
function findRegistryItem(index, name) {
    return index.items.find((item) => item.name === name);
}
function searchRegistryItems(index, query) {
    const normalized = query?.trim().toLowerCase();
    const items = [...index.items].sort((left, right) => left.name.localeCompare(right.name));
    if (!normalized) {
        return items;
    }
    return items.filter((item) => {
        const haystack = [item.name, item.description, item.type, ...(item.tags ?? [])].join(" ").toLowerCase();
        return haystack.includes(normalized);
    });
}
