import fs from "node:fs";
import path from "node:path";
import prompts from "prompts";
import { findRegistryItem } from "../core/registry";
import { themes, generateThemeCssBlock } from "../core/themes";
import { divider, indent, mutedText, section, successText, errorText } from "../utils/console";
import { parseArgs } from "../utils/args";

export async function paletteCommand(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  let [paletteName] = parsed.positionals;
  
  if (!paletteName) {
    const response = await prompts({
      type: "autocomplete",
      name: "palette",
      message: "Which color palette would you like to apply?",
      choices: themes.map((t) => ({ title: t.name, value: t.name })),
    });

    if (!response.palette) {
      console.log(indent(mutedText("Canceled.")));
      return;
    }
    paletteName = response.palette;
  }

  const selectedTheme = themes.find(t => t.name === (paletteName as string)?.toLowerCase());

  if (!selectedTheme) {
    console.log(indent(errorText(`Theme '${paletteName}' not found. Available themes: ${themes.map(t => t.name).join(', ')}`)));
    return;
  }

  const cwd = process.cwd();
  
  const possiblePaths = [
    "app/globals.css",
    "src/app/globals.css",
    "src/globals.css",
    "src/index.css",
    "globals.css",
    "styles/globals.css"
  ];
  
  let targetPath = possiblePaths.find(p => fs.existsSync(path.join(cwd, p)));

  if (!targetPath) {
    const response = await prompts({
      type: "text",
      name: "path",
      message: "Where is your global CSS file located? (e.g. app/globals.css)",
      initial: "app/globals.css"
    });
    
    if (!response.path) {
      console.log(indent(mutedText("Canceled.")));
      return;
    }
    targetPath = response.path;
  }

  const finalPath = targetPath as string;
  const absolutePath = path.join(cwd, finalPath);
  
  if (!fs.existsSync(absolutePath)) {
    console.log(indent(errorText(`File not found: ${finalPath}`)));
    return;
  }

  let cssContent = fs.readFileSync(absolutePath, "utf-8");
  
  const themeRegex = /@layer base\s*\{\s*:root\s*\{[\s\S]*?\.dark\s*\{[\s\S]*?\}\s*\}/;
  
  const newThemeBlock = generateThemeCssBlock(selectedTheme);

  if (themeRegex.test(cssContent)) {
    cssContent = cssContent.replace(themeRegex, newThemeBlock);
  } else {
    cssContent = cssContent + "\n\n" + newThemeBlock + "\n";
  }

  fs.writeFileSync(absolutePath, cssContent);

  section("Palette Applied", successText(`Theme '${selectedTheme.name}' successfully applied to ${finalPath}!`));
  divider();
}
