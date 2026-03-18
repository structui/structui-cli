import { divider, indent, mutedText, section } from "../utils/console";

export async function aboutCommand(): Promise<void> {
  section("About", "Struct UI CLI");
  console.log(indent("Website: https://structui.com"));
  console.log(indent("GitHub: https://github.com/structui"));
  console.log(indent("Purpose: install and manage Struct UI blocks/components"));
  divider();
  console.log(indent(mutedText("Built for a simple npx-first workflow.")));
}
