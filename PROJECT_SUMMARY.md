# Struct UI CLI Summary

## Overview

This repository now contains a TypeScript-based npm CLI named `sui`.

Goal:

- provide a clean `npx sui ...` experience
- install Struct UI components and blocks into a consumer project
- keep local install state
- support future registry-based distribution from Struct UI

Primary references:

- GitHub: `https://github.com/structui`
- Website: `https://structui.com`

## Implemented CLI Surface

The following commands are available:

```bash
sui init
sui add <name>
sui search [query]
sui info <name>
sui list
sui update [name]
sui registry
sui doctor
sui version
sui about
sui help
```

## What Was Built

### 1. TypeScript CLI foundation

- npm package structure with `bin` entry for `sui`
- TypeScript compiler setup
- build and type-check scripts
- distributable `dist/` output

Relevant files:

- `package.json`
- `tsconfig.json`
- `src/cli.ts`
- `src/index.ts`

### 2. Command system

Commands are separated into dedicated modules under `src/commands`.

Implemented command modules:

- `add`
- `about`
- `doctor`
- `help`
- `info`
- `init`
- `list`
- `registry`
- `search`
- `update`
- `version`

### 3. Registry layer

A registry abstraction was created so the CLI can later consume real Struct UI package data.

Capabilities:

- reads registry index
- resolves individual package documents
- supports HTTP registry endpoints
- supports `file://` registries for local development
- caches registry index locally
- includes a local fallback registry for development/offline behavior

Relevant files:

- `src/core/registry.ts`
- `src/core/types.ts`

### 4. Local config and state

The CLI now supports project-local configuration and installed package tracking.

Generated/used files:

- `sui.config.json`
- `.sui/installed.json`
- `.sui/cache/registry-index.json`

Capabilities:

- configurable registry URL
- configurable install directory
- configurable local state path
- configurable cache path
- installed package metadata storage

Relevant files:

- `src/core/config.ts`
- `src/core/state.ts`

### 5. Package install flow

The `add` command:

- looks up a package in the registry
- fetches package details
- writes package files into the configured install directory
- records install metadata locally

This currently works with the included fallback registry and is ready to be connected to a production registry response format.

### 6. Better CLI usability

Additional improvements:

- simple ANSI-based terminal styling
- argument parsing utility
- lightweight version comparison utility
- formatted date output for installed packages and registry metadata

Relevant files:

- `src/utils/console.ts`
- `src/utils/args.ts`
- `src/utils/semver.ts`
- `src/utils/time.ts`

## Current Registry Contract

The CLI expects a registry index similar to:

```json
{
  "registryVersion": 1,
  "updatedAt": "2026-03-17T00:00:00.000Z",
  "items": [
    {
      "name": "hero-banner",
      "type": "block",
      "version": "1.0.0",
      "description": "Marketing hero section",
      "entrypoint": "registry/hero-banner.json",
      "dependencies": [],
      "tags": ["marketing", "hero"]
    }
  ]
}
```

Each package detail document is expected to look like:

```json
{
  "name": "hero-banner",
  "type": "block",
  "version": "1.0.0",
  "description": "Marketing hero section",
  "dependencies": [],
  "tags": ["marketing", "hero"],
  "files": [
    {
      "path": "hero-banner.tsx",
      "content": "export function HeroBanner() {}"
    }
  ]
}
```

## Verified During Setup

The following were run successfully:

- `npm install`
- `npm run check`
- `npm run build`
- multiple local CLI command runs through `node dist/cli.js ...`

Verified command areas:

- help output
- version/about output
- registry search
- package info
- install flow
- list/update flow
- registry metadata
- doctor/init flow

## Current Limitations

- real Struct UI production registry endpoint is not wired yet
- package dependency installation is only declared/displayed, not executed
- there is no `remove` command yet
- there is no interactive prompt mode yet
- there is no remote version check for the CLI package itself

## Recommended Next Steps

### High priority

- connect `https://structui.com` to a real JSON registry endpoint
- define final package schema for components/blocks
- decide overwrite/merge behavior for existing files
- add `remove` command
- add package diff/preview before write

### Distribution

- publish package to npm under final ownership
- verify `npx sui add ...` against a real remote registry
- add CI for build and type-check

### UX improvements

- alias support such as `sui ls`
- interactive package picker
- colored success/error symbols
- install conflict detection
- optional dry-run mode

## Important Files

- `package.json`
- `README.md`
- `sui.config.json`
- `src/index.ts`
- `src/core/registry.ts`
- `src/core/config.ts`
- `src/core/state.ts`
- `src/commands/add.ts`
- `src/commands/init.ts`
- `src/commands/search.ts`
- `src/commands/info.ts`
- `src/commands/list.ts`
- `src/commands/update.ts`

## Final Note

The repository is no longer just an empty placeholder. It now has a real TypeScript CLI foundation, a clean command structure, local state/config support, registry abstraction, offline fallback behavior, and a path toward a production-ready Struct UI package installer.
