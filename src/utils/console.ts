const ANSI = {
  reset: "\u001B[0m",
  dim: "\u001B[2m",
  bold: "\u001B[1m",
  red: "\u001B[31m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  cyan: "\u001B[36m",
  magenta: "\u001B[35m",
  gray: "\u001B[90m",
  bgCyan: "\u001B[46m",
  bgBlack: "\u001B[40m",
  white: "\u001B[37m"
} as const;

function colorize(color: string, value: string): string {
  return `${color}${value}${ANSI.reset}`;
}

export function titleText(value: string): string {
  return colorize(ANSI.bold, value);
}

export function accentText(value: string): string {
  return colorize(ANSI.cyan, value);
}

export function highlightText(value: string): string {
  return colorize(ANSI.magenta, value);
}

export function successText(value: string): string {
  return colorize(ANSI.green, value);
}

export function warningText(value: string): string {
  return colorize(ANSI.yellow, value);
}

export function errorText(value: string): string {
  return colorize(ANSI.red, value);
}

export function mutedText(value: string): string {
  return colorize(ANSI.gray, value);
}

export function divider(): void {
  console.log(mutedText("─".repeat(60)));
}

export function banner(): void {
  console.log("");
  console.log(colorize(ANSI.bgCyan + ANSI.white + ANSI.bold, " STRUCT UI ") + mutedText(" v0.1.7"));
  console.log(mutedText(" Modern React component & block management"));
  console.log("");
}

export function section(title: string, body?: string): void {
  console.log(colorize(ANSI.bold + ANSI.cyan, title.toUpperCase()));
  if (body) {
    console.log(mutedText(body));
  }
}

export function commandGroup(title: string, items: { cmd: string; desc: string }[]): void {
  console.log("");
  console.log(colorize(ANSI.bold, title));
  for (const item of items) {
    const paddedCmd = item.cmd.padEnd(20);
    console.log(`  ${accentText(paddedCmd)} ${mutedText(item.desc)}`);
  }
}

export function formatCommand(command: string): string {
  return accentText(command);
}

export function indent(value: string, spaces = 2): string {
  return `${" ".repeat(spaces)}${value}`;
}

export function example(cmd: string, desc: string): void {
  console.log(indent(`${mutedText("$")} ${cmd}`));
  console.log(indent(mutedText(`// ${desc}`), 4));
}
