import { banner, divider, example, mutedText, section } from "../utils/console";

export async function aboutCommand(): Promise<void> {
  banner();
  
  section("Project Information");
  console.log("");
  console.log(`  ${mutedText("Website")}      https://structui.com`);
  console.log(`  ${mutedText("GitHub")}       https://github.com/structui/struct-cli`);
  console.log(`  ${mutedText("NPM")}          https://www.npmjs.com/package/structui-cli`);
  console.log("");
  
  section("Vision");
  console.log(mutedText("  Providing high-quality, pre-built React components and blocks"));
  console.log(mutedText("  that follow modern design trends and accessibility standards."));
  
  console.log("");
  divider();
  console.log(mutedText("  Built by Struct UI Team • MIT Licensed"));
  console.log("");
}
