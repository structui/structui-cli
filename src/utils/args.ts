export type ParsedArgs = {
  positionals: string[];
  flags: Map<string, string | boolean>;
};

export function parseArgs(args: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags = new Map<string, string | boolean>();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith("-")) {
      positionals.push(arg);
      continue;
    }

    if (arg.includes("=")) {
      const [key, value] = arg.split(/=(.*)/s, 2);
      flags.set(key, value);
      continue;
    }

    const next = args[index + 1];
    if (next && !next.startsWith("-")) {
      flags.set(arg, next);
      index += 1;
      continue;
    }

    flags.set(arg, true);
  }

  return { positionals, flags };
}

export function getFlagValue(parsed: ParsedArgs, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = parsed.flags.get(name);
    if (typeof value === "string") {
      return value;
    }
  }

  return undefined;
}

export function hasFlag(parsed: ParsedArgs, ...names: string[]): boolean {
  return names.some((name) => parsed.flags.has(name));
}
