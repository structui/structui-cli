import { CliConfig, RegistryDetail, RegistryIndex, RegistryIndexItem } from "./types";
export declare function loadRegistryIndex(config: CliConfig, options?: {
    preferCache?: boolean;
}): Promise<RegistryIndex>;
export declare function loadRegistryItem(config: CliConfig, item: RegistryIndexItem): Promise<RegistryDetail>;
export declare function findRegistryItem(index: RegistryIndex, name: string): RegistryIndexItem | undefined;
export declare function searchRegistryItems(index: RegistryIndex, query?: string): RegistryIndexItem[];
