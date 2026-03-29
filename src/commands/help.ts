import { banner, commandGroup, divider, example, mutedText, section } from "../utils/console";

export async function helpCommand(_args: string[] = []): Promise<void> {
  banner();

  commandGroup("🚀 Project Setup", [
    { cmd: "init", desc: "Initialize structui in your project" },
    { cmd: "style", desc: "Change project global CSS (modern, glass, etc.)" },
    { cmd: "palette", desc: "Regenerate theme colors from main color" }
  ]);

  commandGroup("📦 Package Management", [
    { cmd: "add <name>", desc: "Add a block or component to your project" },
    { cmd: "search [query]", desc: "Search for available components" },
    { cmd: "list", desc: "Show installed packages" },
    { cmd: "info <name>", desc: "Get detailed information about a package" },
    { cmd: "update [name]", desc: "Update packages to their latest version" }
  ]);

  commandGroup("🏗️ Scaffolding", [
    { cmd: "setup <type>", desc: "Scaffold a complete app (crm, erp, saas, auth)" }
  ]);

  commandGroup("🛠️ System", [
    { cmd: "doctor", desc: "Check setup for potential issues" },
    { cmd: "registry", desc: "Show active registry status" },
    { cmd: "version", desc: "Show current CLI version" },
    { cmd: "about", desc: "About Struct UI project" }
  ]);

  console.log("");
  section("Examples");
  console.log("");
  example("sui init", "Start by creating a config file");
  example("sui add stats-card", "Add a specific component");
  example("sui setup saas", "Scaffold a full SaaS dashboard");
  
  console.log("");
  divider();
  console.log(mutedText("  Config: ") + "sui.config.json");
  console.log(mutedText("  Documentation: ") + "https://structui.com/docs");
  console.log("");
}
