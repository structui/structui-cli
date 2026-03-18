import { CliConfig, InstalledPackage, InstalledState } from "./types";
export declare function readInstalledState(cwd: string, config: CliConfig): Promise<InstalledState>;
export declare function saveInstalledPackage(cwd: string, config: CliConfig, installedPackage: InstalledPackage): Promise<void>;
export declare function removeInstalledPackage(cwd: string, config: CliConfig, packageName: string): Promise<void>;
