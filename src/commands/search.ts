import { loadConfig } from "../core/config";
import { loadRegistryIndex, searchRegistryItems } from "../core/registry";
import { parseArgs } from "../utils/args";
import { divider, indent, mutedText, section } from "../utils/console";

export async function searchCommand(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  const query = parsed.positionals.join(" ").trim() || undefined;
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);
  const results = searchRegistryItems(index, query);

  section("Registry Search", query ? `Query: ${query}` : mutedText("Showing all packages"));

  if (results.length === 0) {
    console.log(indent(mutedText("No matching packages found.")));
    return;
  }

  divider();
  for (const item of results) {
    console.log(indent(`${item.name} ${mutedText(`(${item.type})`)} ${mutedText(item.version)}`));
    console.log(indent(item.description, 4));
    if (item.tags?.length) {
      console.log(indent(`tags: ${item.tags.join(", ")}`, 4));
    }
    divider();
  }
}
