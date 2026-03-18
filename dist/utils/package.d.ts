type PackageJson = {
    name: string;
    version: string;
    description?: string;
    homepage?: string;
};
export declare function getPackageJson(): Promise<PackageJson>;
export {};
