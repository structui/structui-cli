import type { AuthProvider, SetupFile } from "./types";
export interface AuthProviderResult {
    files: SetupFile[];
    dependencies: string[];
    devDependencies: string[];
    instructions: string[];
}
export declare function generateAuthProvider(provider: AuthProvider): AuthProviderResult;
