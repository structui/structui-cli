export type ParsedArgs = {
    positionals: string[];
    flags: Map<string, string | boolean>;
};
export declare function parseArgs(args: string[]): ParsedArgs;
export declare function getFlagValue(parsed: ParsedArgs, ...names: string[]): string | undefined;
export declare function hasFlag(parsed: ParsedArgs, ...names: string[]): boolean;
