# Struct UI CLI

Minimal, fast TypeScript CLI for Struct UI packages.

## Commands

```bash
npx sui init
npx sui add hero-banner
npx sui search hero
npx sui info hero-banner
npx sui list
npx sui update
npx sui registry
npx sui doctor
npx sui version
npx sui about
```

## Local development

```bash
npm install
npm run build
node dist/cli.js help
```

## Registry contract

The CLI expects a registry index shaped like this:

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

Each item detail document should look like this:

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
      "path": "components/struct/hero-banner.tsx",
      "content": "export function HeroBanner() {}"
    }
  ]
}
```

Use `SUI_REGISTRY_URL` to point the CLI at a production registry endpoint.

## Generated files

- `sui.config.json`: local CLI configuration
- `.sui/installed.json`: installed package state
- `.sui/cache/registry-index.json`: cached registry index for offline reads
