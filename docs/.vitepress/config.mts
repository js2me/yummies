import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineDocsVitepressConfig } from "sborshik/vitepress";
import { ConfigsManager } from "sborshik/utils/configs-manager";

const configs = ConfigsManager.create("../");

const docsDir = join(fileURLToPath(import.meta.url), "..", "..");
const sidebarApiPath = join(docsDir, "api", "_sidebar.json");
type SidebarItem = { text: string; link?: string; items?: SidebarItem[] };
const apiSidebarItems: SidebarItem[] = existsSync(sidebarApiPath)
  ? (JSON.parse(readFileSync(sidebarApiPath, "utf-8")) as SidebarItem[])
  : [];

function firstLink(items: SidebarItem[]): string | undefined {
  for (const item of items) {
    if (item.link) return item.link;
    if (item.items?.length) {
      const found = firstLink(item.items);
      if (found) return found;
    }
  }
  return undefined;
}

export default defineDocsVitepressConfig(configs, {
  appearance: 'dark',
  createdYear: '2025',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Reference', link: firstLink(apiSidebarItems) ?? '/api/async' },
      { text: 'Changelog', link: `https://github.com/${configs.package.author}/${configs.package.name}/releases` },
      {
        text: `${configs.package.version}`,
        items: [
          {
            items: [
              {
                text: `${configs.package.version}`,
                link: `https://github.com/${configs.package.author}/${configs.package.name}/releases/tag/${configs.package.version}`,
              },
            ],
          },
        ],
      },
    ],
    sidebar: [
      ...(apiSidebarItems.length > 0
        ? [{ text: 'API Reference', items: apiSidebarItems }]
        : []),
    ],
  },
});
