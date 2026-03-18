import { getPackageJson } from "../utils/package";
import { accentText, section } from "../utils/console";

export async function versionCommand(): Promise<void> {
  const pkg = await getPackageJson();
  section("Version", `${accentText(pkg.name)} ${pkg.version}`);
}
