# Struct UI CLI

The official command-line tool for [Struct UI](https://structui.com). Install components and blocks directly into your project, scaffold full application setups, and manage styles — all without leaving the terminal.

```bash
npx sui add button
```

---

## Requirements

- Node.js `>=18.17`
- A Next.js project using Tailwind CSS v4

---

## Quick Start

```bash
# 1. Initialize Struct UI in your project
npx sui init

# 2. Apply the base stylesheet to your globals.css
npx sui style

# 3. Add className="dark" to your <html> element, then browse and install
npx sui search
npx sui add button
```

> Components and blocks rely on CSS custom properties defined by `sui style`. Skipping this step will result in unstyled output.

---

## Commands

### `sui init`

Scaffolds the Struct UI configuration in your project. Creates `sui.config.json`, install directories, a `cn()` utility, and installs `clsx` + `tailwind-merge`.

```bash
npx sui init
```

---

### `sui add <name>`

Installs a component or block from the registry into your project.

```bash
npx sui add button
npx sui add hero-section
npx sui add pricing-section
```

Blocks are installed to `components/struct/` by default. When a block is installed, the CLI will remind you to run `sui style` and confirm your `<html>` element carries a theme class.

---

### `sui setup <type>`

Scaffolds a complete application starter with pages, layouts, and components pre-wired.

```bash
npx sui setup crm
npx sui setup erp
npx sui setup saas
npx sui setup auth
```

You can also use shorthand via `add`:

```bash
npx sui add crm-setup
npx sui add erp-setup
npx sui add saas-setup
npx sui add auth-setup
```

Supported auth providers during setup: `next-auth`, `better-auth`, `basic-auth`, `none`.

---

### `sui search [query]`

Searches the registry. Supports filtering by type.

```bash
npx sui search             # list everything
npx sui search hero        # keyword search
npx sui search --blocks    # blocks only
npx sui search --components  # components only
npx sui search --type block pricing
```

---

### `sui style`

Writes the complete Struct UI stylesheet to your global CSS file. Includes CSS custom properties, theme tokens, keyframe animations, and sheet/dialog/overlay utilities.

```bash
npx sui style
```

The CLI auto-detects common CSS file paths (`app/globals.css`, `src/app/globals.css`, etc.). If none is found, you will be prompted.

---

### `sui palette <theme>`

Swaps the color palette in your global CSS file without touching other styles.

```bash
npx sui palette default
npx sui palette rose
npx sui palette midnight
npx sui palette khaki
```

Run without arguments for an interactive picker.

---

### `sui info <name>`

Displays registry metadata for a specific package: version, description, dependencies, tags, and file paths.

```bash
npx sui info button
npx sui info hero-section
```

---

### `sui list`

Lists all locally installed packages with version and update status.

```bash
npx sui list
```

---

### `sui update [name]`

Updates one package or all outdated packages.

```bash
npx sui update            # update everything
npx sui update button     # update a specific package
```

---

### `sui doctor`

Validates your local Struct UI setup: config file, install path, utils path, and state file.

```bash
npx sui doctor
```

---

### `sui registry`

Prints live metadata from the registry endpoint: version, item count, and last updated timestamp.

```bash
npx sui registry
```

---

### `sui version` · `sui about`

```bash
npx sui version   # print CLI version
npx sui about     # project links and metadata
```

---

## Configuration

Running `sui init` creates `sui.config.json` at the project root:

```json
{
  "registryUrl": "https://structui.com/api/registry/index.json",
  "installPath": "components/struct",
  "statePath": ".sui/installed.json",
  "cachePath": ".sui/cache/registry-index.json",
  "utilsPath": "src/lib/utils.ts"
}
```

All fields are optional — the CLI falls back to these defaults if the file is absent.

To point the CLI at a custom or self-hosted registry, set the environment variable:

```bash
SUI_REGISTRY_URL=https://my-registry.example.com/api/registry/index.json npx sui search
```

---

## Generated Files

| Path | Purpose |
|---|---|
| `sui.config.json` | Local CLI configuration |
| `.sui/installed.json` | Installed package state |
| `.sui/cache/registry-index.json` | Cached registry index for offline reads |

---

## Registry Contract

The CLI expects the registry index at `registryUrl` to return:

```json
{
  "registryVersion": 1,
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "items": [
    {
      "name": "button",
      "type": "component",
      "version": "1.0.0",
      "description": "Accessible button component.",
      "entrypoint": "components/button.json",
      "dependencies": [],
      "tags": ["general", "form"]
    }
  ]
}
```

Each item detail document (resolved from `entrypoint`) must follow:

```json
{
  "name": "button",
  "type": "component",
  "version": "1.0.0",
  "description": "Accessible button component.",
  "dependencies": [],
  "tags": ["general", "form"],
  "files": [
    {
      "path": "button.tsx",
      "content": "export function Button() {}"
    }
  ]
}
```

Blocks follow the same shape with `"type": "block"` and entrypoints under `blocks/`.

---

## Local Development

```bash
git clone https://github.com/structui/struct-cli.git
cd struct-cli
npm install
npm run build
node dist/cli.js help
```

Type-check without emitting:

```bash
npm run check
```

---

## License

MIT — [structui.com](https://structui.com)
