#!/usr/bin/env tsx

import { join } from "node:path";
import { PackageJsonManager } from 'js2me-exports-post-build-script/utils/package-json-manager';

function processExportsField() {
  const pckgJson = new PackageJsonManager(
    join(process.cwd(), "./package.json")
  );

  const exportEntries  = Object.entries(pckgJson.data.exports) as unknown as [string, Record<string, string | Record<string, string>> | string][];

  exportEntries.forEach(([key, exportData]) => {
    if (typeof exportData === 'object') {
      exportData.types = String(exportData.types).replace('.d.cts', '.d.ts');
      exportData.import = {
        types: exportData.types,
        default: String(exportData.import)
      }
      exportData.require = {
        types: exportData.types.replace('.d.ts', '.d.cts'),
        default: String(exportData.require)
      }
      // exportData.require = exportData.types.replace('.d.ts', '.cjs');
    }
  })

  pckgJson.syncWithFs();

  console.log('process exports field OK');
}

// Run the script
processExportsField();