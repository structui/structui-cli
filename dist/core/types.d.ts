export type RegistryItemType = "component" | "block";
export type RegistryIndexItem = {
    name: string;
    type: RegistryItemType;
    version: string;
    description: string;
    entrypoint: string;
    dependencies: string[];
    tags?: string[];
};
export type RegistryIndex = {
    registryVersion: number;
    updatedAt: string;
    items: RegistryIndexItem[];
};
export type RegistryFile = {
    path: string;
    content: string;
};
export type RegistryDetail = {
    name: string;
    type: RegistryItemType;
    version: string;
    description: string;
    dependencies?: string[];
    tags?: string[];
    files: RegistryFile[];
};
export type InstalledPackage = {
    name: string;
    type: RegistryItemType;
    version: string;
    installedAt: string;
    targetPaths: string[];
    source: string;
};
export type InstalledState = {
    packages: InstalledPackage[];
};
export type CliConfig = {
    registryUrl: string;
    installPath: string;
    statePath: string;
    cachePath: string;
    utilsPath: string;
};
