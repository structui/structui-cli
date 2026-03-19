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

  @keyframes meteor {
    0% { transform: rotate(215deg) translateX(0); opacity: 1; }
    70% { opacity: 1; }
    100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
  }
  --animation-meteor-effect: meteor 5s linear infinite;

  @keyframes spotlight {
    0% { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
    100% { opacity: 1; transform: translate(-50%,-40%) scale(1); }
  }
  --animation-spotlight: spotlight 2s ease .75s 1 forwards;

  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes stretch {
    0%, 100% { height: 40%; }
    50% { height: 100%; }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  @keyframes flip {
    0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
    50% { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
    100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); }
  }

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
  @keyframes ui-overlay-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes ui-overlay-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes ui-dialog-in {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes ui-dialog-out {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.98); }
  }
  @keyframes ui-sheet-right-in {
    from { opacity: 0; transform: translate3d(20px, 0, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ui-sheet-right-out {
    from { opacity: 1; transform: translate3d(0, 0, 0); }
    to { opacity: 0; transform: translate3d(20px, 0, 0); }
  }
  @keyframes ui-sheet-left-in {
    from { opacity: 0; transform: translate3d(-20px, 0, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ui-sheet-left-out {
    from { opacity: 1; transform: translate3d(0, 0, 0); }
    to { opacity: 0; transform: translate3d(-20px, 0, 0); }
  }
  @keyframes ui-sheet-top-in {
    from { opacity: 0; transform: translate3d(0, -20px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ui-sheet-top-out {
    from { opacity: 1; transform: translate3d(0, 0, 0); }
    to { opacity: 0; transform: translate3d(0, -20px, 0); }
  }
  @keyframes ui-sheet-bottom-in {
    from { opacity: 0; transform: translate3d(0, 20px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes ui-sheet-bottom-out {
    from { opacity: 1; transform: translate3d(0, 0, 0); }
    to { opacity: 0; transform: translate3d(0, 20px, 0); }
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

  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--muted-foreground) 30%, transparent);
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--primary) 60%, transparent);
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--muted-foreground) 30%, transparent) transparent;
  }
}

@layer utilities {
  .ui-overlay[data-state="open"] {
    animation: ui-overlay-in 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .ui-overlay[data-state="closed"] {
    animation: ui-overlay-out 170ms cubic-bezier(0.4, 0, 1, 1) forwards;
  }
  .ui-dialog-content[data-state="open"],
  .ui-alert-content[data-state="open"] {
    animation: ui-dialog-in 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .ui-dialog-content[data-state="closed"],
  .ui-alert-content[data-state="closed"] {
    animation: ui-dialog-out 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
  }
  .ui-sheet-content[data-state="open"][data-side="right"] {
    animation: ui-sheet-right-in 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .ui-sheet-content[data-state="closed"][data-side="right"] {
    animation: ui-sheet-right-out 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
  }
  .ui-sheet-content[data-state="open"][data-side="left"] {
    animation: ui-sheet-left-in 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .ui-sheet-content[data-state="closed"][data-side="left"] {
    animation: ui-sheet-left-out 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
  }
  .ui-sheet-content[data-state="open"][data-side="top"] {
    animation: ui-sheet-top-in 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .ui-sheet-content[data-state="closed"][data-side="top"] {
    animation: ui-sheet-top-out 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
  }
  .ui-sheet-content[data-state="open"][data-side="bottom"] {
    animation: ui-sheet-bottom-in 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .ui-sheet-content[data-state="closed"][data-side="bottom"] {
    animation: ui-sheet-bottom-out 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    .ui-overlay[data-state],
    .ui-dialog-content[data-state],
    .ui-alert-content[data-state],
    .ui-sheet-content[data-state] {
      animation: none !important;
    }
  }

  .bg-grid-white\\/\\[0\\.05\\] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.05'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
  }
  .bg-grid-black\\/\\[0\\.05\\] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='black' stroke-opacity='0.05'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
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
