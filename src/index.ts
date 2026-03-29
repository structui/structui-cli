import { addCommand } from "./commands/add";
import { aboutCommand } from "./commands/about";
import { doctorCommand } from "./commands/doctor";
import { helpCommand } from "./commands/help";
import { infoCommand } from "./commands/info";
import { initCommand } from "./commands/init";
import { listCommand } from "./commands/list";
import { registryCommand } from "./commands/registry";
import { searchCommand } from "./commands/search";
import { setupCommand } from "./commands/setup";
import { updateCommand } from "./commands/update";
import { versionCommand } from "./commands/version";
import { styleCommand } from "./commands/style";
import { paletteCommand } from "./commands/palette";
import { errorText } from "./utils/console";

type CommandHandler = (args: string[]) => Promise<void>;

/**
 * Command registry for the Struct UI CLI.
 * Maps command names and their aliases to handler functions.
 */
const COMMANDS: Record<string, CommandHandler> = {
  // Setup & init
  init: initCommand,
  setup: setupCommand,
  style: styleCommand,
  palette: paletteCommand,

  // Package management
  add: addCommand,
  search: searchCommand,
  info: infoCommand,
  list: listCommand,
  update: updateCommand,

  // System & Information
  registry: registryCommand,
  doctor: doctorCommand,
  version: versionCommand,
  about: aboutCommand,
  help: helpCommand,

  // Global Flags
  "--help": helpCommand,
  "-h": helpCommand,
  "--version": versionCommand,
  "-v": versionCommand
};

const SETUP_ALIASES = ["crm", "erp", "saas", "auth"];

/**
 * Main entry point for the CLI.
 * Parses arguments and dispatches to the appropriate command handler.
 */
export async function run(args: string[]): Promise<void> {
  let [command = "help", ...rest] = args;
  
  // Normalize command aliases for setup
  if (SETUP_ALIASES.includes(command)) {
    rest = [command, ...rest];
    command = "setup";
  } else if (SETUP_ALIASES.some(alias => command === `${alias}-setup`)) {
    rest = [command.replace("-setup", ""), ...rest];
    command = "setup";
  }

  const handler = COMMANDS[command];

  if (!handler) {
    console.error(errorText(`Error: Unknown command "${command}"`));
    console.log("");
    await helpCommand([]);
    process.exitCode = 1;
    return;
  }

  try {
    await handler(rest);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("");
    console.error(errorText(`CRITICAL ERROR: ${message}`));
    
    if (process.env.DEBUG) {
      console.error(error);
    }
    
    process.exitCode = 1;
  }
}
