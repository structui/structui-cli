import path from "node:path";
import { readJsonFile, writeJsonFile } from "../utils/fs";
import { CliConfig, InstalledPackage, InstalledState } from "./types";

const EMPTY_STATE: InstalledState = { packages: [] };

export async function readInstalledState(cwd: string, config: CliConfig): Promise<InstalledState> {
  return (await readJsonFile<InstalledState>(path.join(cwd, config.statePath))) ?? EMPTY_STATE;
}

export async function saveInstalledPackage(
  cwd: string,
  config: CliConfig,
  installedPackage: InstalledPackage
): Promise<void> {
  const statePath = path.join(cwd, config.statePath);
  const state = await readInstalledState(cwd, config);
  const nextPackages = state.packages.filter((item) => item.name !== installedPackage.name);
  nextPackages.push(installedPackage);
  nextPackages.sort((left, right) => left.name.localeCompare(right.name));

  await writeJsonFile(statePath, { packages: nextPackages });
}

export async function removeInstalledPackage(
  cwd: string,
  config: CliConfig,
  packageName: string
): Promise<void> {
  const statePath = path.join(cwd, config.statePath);
  const state = await readInstalledState(cwd, config);
  const nextPackages = state.packages.filter((item) => item.name !== packageName);

  await writeJsonFile(statePath, { packages: nextPackages });
}
