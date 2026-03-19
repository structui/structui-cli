"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themes = void 0;
exports.generateThemeCssBlock = generateThemeCssBlock;
exports.themes = [
    {
        name: "default",
        light: {
            "--background": "#f7f8fa",
            "--foreground": "#1a1a1a",
            "--card": "#ffffff",
            "--card-foreground": "#1a1a1a",
            "--popover": "#ffffff",
            "--popover-foreground": "#1a1a1a",
            "--primary": "#1a1a1a",
            "--primary-foreground": "#f7f8fa",
            "--secondary": "#e2e4e9",
            "--secondary-foreground": "#1a1a1a",
            "--muted": "#e2e4e9",
            "--muted-foreground": "#6b7280",
            "--accent": "#e2e4e9",
            "--accent-foreground": "#1a1a1a",
            "--destructive": "#ef4444",
            "--destructive-foreground": "#f7f8fa",
            "--border": "#e2e4e9",
            "--input:": "#e2e4e9",
            "--ring:": "#1a1a1a",
            "--radius:": "0.25rem"
        },
        dark: {
            "--background": "#0f1115",
            "--foreground": "#e2e4e9",
            "--card": "#14161a",
            "--card-foreground": "#e2e4e9",
            "--popover": "#14161a",
            "--popover-foreground": "#e2e4e9",
            "--primary": "#e2e4e9",
            "--primary-foreground": "#0f1115",
            "--secondary": "#1b1e23",
            "--secondary-foreground": "#e2e4e9",
            "--muted": "#1b1e23",
            "--muted-foreground": "#9ca3af",
            "--accent": "#1b1e23",
            "--accent-foreground": "#e2e4e9",
            "--destructive": "#7f1d1d",
            "--destructive-foreground": "#e2e4e9",
            "--border": "#1b1e23",
            "--input": "#1b1e23",
            "--ring": "#e2e4e9"
        }
    },
    {
        name: "rose",
        light: {
            "--background": "#fff1f2",
            "--foreground": "#4c0519",
            "--card": "#ffffff",
            "--card-foreground": "#4c0519",
            "--popover": "#ffffff",
            "--popover-foreground": "#4c0519",
            "--primary": "#e11d48",
            "--primary-foreground": "#ffffff",
            "--secondary": "#ffe4e6",
            "--secondary-foreground": "#e11d48",
            "--muted": "#ffe4e6",
            "--muted-foreground": "#9f1239",
            "--accent": "#ffe4e6",
            "--accent-foreground": "#e11d48",
            "--destructive": "#dc2626",
            "--destructive-foreground": "#ffffff",
            "--border": "#fecdd3",
            "--input": "#fecdd3",
            "--ring": "#e11d48",
            "--radius": "0.5rem"
        },
        dark: {
            "--background": "#4c0519",
            "--foreground": "#fff1f2",
            "--card": "#2a0410",
            "--card-foreground": "#fff1f2",
            "--popover": "#2a0410",
            "--popover-foreground": "#fff1f2",
            "--primary": "#e11d48",
            "--primary-foreground": "#ffffff",
            "--secondary": "#881337",
            "--secondary-foreground": "#fff1f2",
            "--muted": "#881337",
            "--muted-foreground": "#fda4af",
            "--accent": "#881337",
            "--accent-foreground": "#fff1f2",
            "--destructive": "#b91c1c",
            "--destructive-foreground": "#ffffff",
            "--border": "#881337",
            "--input": "#881337",
            "--ring": "#f43f5e"
        }
    },
    {
        name: "midnight",
        light: {
            "--background": "#eff6ff",
            "--foreground": "#1e3a8a",
            "--card": "#ffffff",
            "--card-foreground": "#1e3a8a",
            "--popover": "#ffffff",
            "--popover-foreground": "#1e3a8a",
            "--primary": "#1d4ed8",
            "--primary-foreground": "#ffffff",
            "--secondary": "#dbeafe",
            "--secondary-foreground": "#1d4ed8",
            "--muted": "#dbeafe",
            "--muted-foreground": "#1e40af",
            "--accent": "#dbeafe",
            "--accent-foreground": "#1d4ed8",
            "--destructive": "#ef4444",
            "--destructive-foreground": "#ffffff",
            "--border": "#bfdbfe",
            "--input": "#bfdbfe",
            "--ring": "#1d4ed8",
            "--radius": "0.3rem"
        },
        dark: {
            "--background": "#020617",
            "--foreground": "#f8fafc",
            "--card": "#0f172a",
            "--card-foreground": "#f8fafc",
            "--popover": "#0f172a",
            "--popover-foreground": "#f8fafc",
            "--primary": "#3b82f6",
            "--primary-foreground": "#0f172a",
            "--secondary": "#1e293b",
            "--secondary-foreground": "#f8fafc",
            "--muted": "#1e293b",
            "--muted-foreground": "#94a3b8",
            "--accent": "#1e293b",
            "--accent-foreground": "#f8fafc",
            "--destructive": "#991b1b",
            "--destructive-foreground": "#f8fafc",
            "--border": "#1e293b",
            "--input": "#1e293b",
            "--ring": "#3b82f6"
        }
    },
    {
        name: "khaki",
        light: {
            "--background": "#f0f2eb",
            "--foreground": "#2d331f",
            "--card": "#f8f9f5",
            "--card-foreground": "#2d331f",
            "--popover": "#f8f9f5",
            "--popover-foreground": "#2d331f",
            "--primary": "#4e5c35",
            "--primary-foreground:": "#f0f2eb",
            "--secondary": "#dfe3d5",
            "--secondary-foreground": "#4e5c35",
            "--muted": "#dfe3d5",
            "--muted-foreground": "#6b7a45",
            "--accent": "#dfe3d5",
            "--accent-foreground": "#4e5c35",
            "--destructive": "#ef4444",
            "--destructive-foreground": "#f0f2eb",
            "--border": "#dfe3d5",
            "--input": "#dfe3d5",
            "--ring": "#4e5c35",
            "--radius": "0.25rem"
        },
        dark: {
            "--background": "#1a1c14",
            "--foreground": "#dfe3d5",
            "--card": "#22251a",
            "--card-foreground": "#dfe3d5",
            "--popover": "#22251a",
            "--popover-foreground": "#dfe3d5",
            "--primary": "#7f8f55",
            "--primary-foreground": "#1a1c14",
            "--secondary": "#2d331f",
            "--secondary-foreground": "#dfe3d5",
            "--muted": "#2d331f",
            "--muted-foreground": "#8b9a65",
            "--accent": "#2d331f",
            "--accent-foreground": "#dfe3d5",
            "--destructive": "#7f1d1d",
            "--destructive-foreground": "#dfe3d5",
            "--border": "#2d331f",
            "--input": "#2d331f",
            "--ring": "#7f8f55"
        }
    }
];
function generateThemeCssBlock(theme) {
    const lightVars = Object.entries(theme.light).map(([k, v]) => `    ${k}: ${v};`).join("\n");
    const darkVars = Object.entries(theme.dark).map(([k, v]) => `    ${k}: ${v};`).join("\n");
    return `@layer base {
  :root {
${lightVars}
  }

  .dark {
${darkVars}
  }
}`;
}
