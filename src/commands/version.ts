import { getPackageJson } from "../utils/package";
import { accentText, mutedText } from "../utils/console";

export async function versionCommand(): Promise<void> {
  const pkg = await getPackageJson();
  console.log(`${accentText(pkg.name)} ${mutedText("v")}${pkg.version}`);
}
