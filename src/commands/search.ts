import { loadConfig } from "../core/config";
import { loadRegistryIndex, searchRegistryItems } from "../core/registry";
import { parseArgs, getFlagValue, hasFlag } from "../utils/args";
import { divider, indent, mutedText, section } from "../utils/console";
import type { RegistryItemType } from "../core/types";

export async function searchCommand(args: string[]): Promise<void> {
  const parsed = parseArgs(args);
  const query = parsed.positionals.join(" ").trim() || undefined;
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const index = await loadRegistryIndex(config);

  let typeFilter: RegistryItemType | undefined;
  if (hasFlag(parsed, "--blocks", "-b")) {
    typeFilter = "block";
  } else if (hasFlag(parsed, "--components", "-c")) {
    typeFilter = "component";
  } else {
    const typeValue = getFlagValue(parsed, "--type", "-t");
    if (typeValue === "block" || typeValue === "component") {
      typeFilter = typeValue;
    }
  }

  let results = searchRegistryItems(index, query);
  if (typeFilter) {
    results = results.filter((item) => item.type === typeFilter);
  }

  const typeLabel = typeFilter ? ` [${typeFilter}s only]` : "";
  section("Registry Search", query ? `Query: ${query}${typeLabel}` : mutedText(`Showing all packages${typeLabel}`));

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
