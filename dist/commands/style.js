"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleCommand = styleCommand;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const prompts_1 = __importDefault(require("prompts"));
const console_1 = require("../utils/console");
const DEFAULT_GLOBAL_CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Poppins", ui-sans-serif, system-ui, sans-serif;
  
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  @keyframes accordion-down {
    from { height: 0; opacity: 0; transform: translateY(-4px); }
    to { height: var(--radix-accordion-content-height); opacity: 1; transform: translateY(0); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); opacity: 1; transform: translateY(0); }
    to { height: 0; opacity: 0; transform: translateY(-4px); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in-left {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  --animation-accordion-down: accordion-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  --animation-accordion-up: accordion-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  --animation-fade-in: fade-in 0.3s ease-out forwards;
  --animation-slide-in-left: slide-in-left 0.3s ease-out forwards;
  --animation-scale-in: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@layer base {
  :root {
    --background: #f7f8fa;
    --foreground: #1a1a1a;
    --card: #ffffff;
    --card-foreground: #1a1a1a;
    --popover: #ffffff;
    --popover-foreground: #1a1a1a;
    --primary: #1a1a1a;
    --primary-foreground: #f7f8fa;
    --secondary: #e2e4e9;
    --secondary-foreground: #1a1a1a;
    --muted: #e2e4e9;
    --muted-foreground: #6b7280;
    --accent: #e2e4e9;
    --accent-foreground: #1a1a1a;
    --destructive: #ef4444;
    --destructive-foreground: #f7f8fa;
    --border: #e2e4e9;
    --input: #e2e4e9;
    --ring: #1a1a1a;
    --radius: 0.25rem;
  }

  .dark {
    --background: #0f1115;
    --foreground: #e2e4e9;
    --card: #14161a;
    --card-foreground: #e2e4e9;
    --popover: #14161a;
    --popover-foreground: #e2e4e9;
    --primary: #e2e4e9;
    --primary-foreground: #0f1115;
    --secondary: #1b1e23;
    --secondary-foreground: #e2e4e9;
    --muted: #1b1e23;
    --muted-foreground: #9ca3af;
    --accent: #1b1e23;
    --accent-foreground: #e2e4e9;
    --destructive: #7f1d1d;
    --destructive-foreground: #e2e4e9;
    --border: #1b1e23;
    --input: #1b1e23;
    --ring: #e2e4e9;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased font-light;
  }
}
`;
async function styleCommand(args) {
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
    const dir = node_path_1.default.dirname(absolutePath);
    if (!node_fs_1.default.existsSync(dir)) {
        node_fs_1.default.mkdirSync(dir, { recursive: true });
    }
    node_fs_1.default.writeFileSync(absolutePath, DEFAULT_GLOBAL_CSS);
    (0, console_1.section)("Styles Configured", (0, console_1.successText)(`Struct UI default styles applied to ${finalPath}`));
    (0, console_1.divider)();
    console.log((0, console_1.indent)((0, console_1.mutedText)("Try changing the theme with 'npx sui palette <theme>'")));
}
