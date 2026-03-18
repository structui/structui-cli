import { readFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = {
  name: string;
  version: string;
  description?: string;
  homepage?: string;
};

let cachedPackageJson: PackageJson | null = null;

export async function getPackageJson(): Promise<PackageJson> {
  if (cachedPackageJson) {
    return cachedPackageJson;
  }

  const packagePath = path.resolve(__dirname, "..", "..", "package.json");
  const raw = await readFile(packagePath, "utf8");
  cachedPackageJson = JSON.parse(raw) as PackageJson;
  return cachedPackageJson;
}
