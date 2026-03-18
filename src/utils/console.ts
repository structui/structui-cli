const ANSI = {
  reset: "\u001B[0m",
  dim: "\u001B[2m",
  bold: "\u001B[1m",
  red: "\u001B[31m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  cyan: "\u001B[36m",
  gray: "\u001B[90m"
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
  console.log(mutedText("─".repeat(56)));
}

export function section(title: string, body?: string): void {
  console.log(titleText(title));
  if (body) {
    console.log(body);
  }
}

export function formatCommand(command: string): string {
  return accentText(command);
}

export function indent(value: string, spaces = 2): string {
  return `${" ".repeat(spaces)}${value}`;
}
