import { addCommand } from "./commands/add";
import { aboutCommand } from "./commands/about";
import { doctorCommand } from "./commands/doctor";
import { helpCommand } from "./commands/help";
import { infoCommand } from "./commands/info";
import { initCommand } from "./commands/init";
import { listCommand } from "./commands/list";
import { registryCommand } from "./commands/registry";
import { searchCommand } from "./commands/search";
import { updateCommand } from "./commands/update";
import { versionCommand } from "./commands/version";
import { errorText } from "./utils/console";

type CommandHandler = (args: string[]) => Promise<void>;

const commands = new Map<string, CommandHandler>([
  ["init", initCommand],
  ["add", addCommand],
  ["search", searchCommand],
  ["info", infoCommand],
  ["list", listCommand],
  ["update", updateCommand],
  ["registry", registryCommand],
  ["doctor", doctorCommand],
  ["version", versionCommand],
  ["about", aboutCommand],
  ["help", helpCommand],
  ["--help", helpCommand],
  ["-h", helpCommand],
  ["--version", versionCommand],
  ["-v", versionCommand]
]);

export async function run(args: string[]): Promise<void> {
  const [command = "help", ...rest] = args;
  const handler = commands.get(command);

  if (!handler) {
    console.error(errorText(`Unknown command: ${command}`));
    await helpCommand([]);
    process.exitCode = 1;
    return;
  }

  try {
    await handler(rest);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(errorText(message));
    process.exitCode = 1;
  }
}
