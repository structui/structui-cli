import path from "node:path";
import { readJsonFile } from "../utils/fs";
import { CliConfig } from "./types";

type PartialCliConfig = Partial<CliConfig>;

const DEFAULT_REGISTRY_URL =
  process.env.SUI_REGISTRY_URL ?? "https://structui.com/api/registry/index.json";

export async function loadConfig(cwd: string): Promise<CliConfig> {
  const localConfigPath = path.join(cwd, "sui.config.json");
  const config = (await readJsonFile<PartialCliConfig>(localConfigPath)) ?? {};

  return {
    registryUrl: config.registryUrl ?? DEFAULT_REGISTRY_URL,
    installPath: config.installPath ?? "components/struct",
    statePath: config.statePath ?? ".sui/installed.json",
    cachePath: config.cachePath ?? ".sui/cache/registry-index.json",
    utilsPath: config.utilsPath ?? "src/lib/utils.ts"
  };
}
