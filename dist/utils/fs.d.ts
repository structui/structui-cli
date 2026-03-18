export declare function ensureDir(dir: string): Promise<void>;
export declare function readJsonFile<T>(filePath: string): Promise<T | null>;
export declare function writeJsonFile(filePath: string, value: unknown): Promise<void>;
export declare function writeTextFile(filePath: string, value: string): Promise<void>;
