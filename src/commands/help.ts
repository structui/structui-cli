import { divider, formatCommand, indent, mutedText, section } from "../utils/console";

export async function helpCommand(_args: string[] = []): Promise<void> {
  section("Struct UI CLI", mutedText("Minimal package installer for Struct UI blocks and components."));
  divider();
  console.log(indent(`${formatCommand("sui init")}              Create config and local Struct UI directories`));
  console.log(indent(`${formatCommand("sui add <name>")}        Install a block or component`));
  console.log(indent(`${formatCommand("sui setup <type>")}      Scaffold a full app setup (crm | erp | saas | auth)`));
  console.log(indent(`${formatCommand("sui add crm-setup")}     Shorthand: scaffold a CRM setup`));
  console.log(indent(`${formatCommand("sui add erp-setup")}     Shorthand: scaffold an ERP setup`));
  console.log(indent(`${formatCommand("sui add saas-setup")}    Shorthand: scaffold a SaaS setup`));
  console.log(indent(`${formatCommand("sui add auth-setup")}    Shorthand: scaffold an Auth-only setup`));
  console.log(indent(`${formatCommand("sui search [query]")}    Search registry packages`));
  console.log(indent(`${formatCommand("sui info <name>")}       Show package details`));
  console.log(indent(`${formatCommand("sui list")}              Show installed packages and status`));
  console.log(indent(`${formatCommand("sui update [name]")}     Update one package or everything outdated`));
  console.log(indent(`${formatCommand("sui registry")}          Show registry metadata`));
  console.log(indent(`${formatCommand("sui doctor")}            Validate local setup`));
  console.log(indent(`${formatCommand("sui version")}           Show CLI version`));
  console.log(indent(`${formatCommand("sui about")}             Project links and metadata`));
  console.log(indent(`${formatCommand("sui help")}              Show command help`));
  divider();
  console.log(indent("Config file: sui.config.json"));
  console.log(indent("Env override: SUI_REGISTRY_URL"));
}
