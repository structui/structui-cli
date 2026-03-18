import path from "node:path";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { loadConfig } from "../core/config";
import { readInstalledState } from "../core/state";
import { divider, indent, section, successText, warningText } from "../utils/console";

async function canAccess(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function doctorCommand(): Promise<void> {
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const state = await readInstalledState(cwd, config);

  const checks = [
    {
      label: "config",
      ok: await canAccess(path.join(cwd, "sui.config.json"))
    },
    {
      label: "install directory",
      ok: await canAccess(path.join(cwd, config.installPath))
    },
    {
      label: "state file",
      ok: await canAccess(path.join(cwd, config.statePath))
    },
    {
      label: "packages installed",
      ok: state.packages.length > 0
    }
  ];

  section("Doctor");
  divider();
  for (const check of checks) {
    const stateText = check.ok ? successText("ok") : warningText("missing");
    console.log(indent(`${check.label}: ${stateText}`));
  }
}
