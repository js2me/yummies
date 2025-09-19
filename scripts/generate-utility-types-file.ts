#!/usr/bin/env tsx

import { join } from "node:path";
import { PackageJsonManager } from 'js2me-exports-post-build-script/utils/package-json-manager';
import { $ } from "js2me-exports-post-build-script/utils";

function generateUtilityTypesFile() {
  $(`cp dist/utils/types.d.ts utility-types.d.ts`, undefined, true);
  $(`sed -i 's/^export type/type/' utility-types.d.ts`, undefined, true);

  const pckgJson = new PackageJsonManager(
    join(process.cwd(), "./package.json")
  );

  console.log(join(process.cwd(), "./package.json"))
  
  pckgJson.data.exports['./utility-types']['types'] = './utility-types.d.ts';

  pckgJson.syncWithFs();

  console.log('generated utility types file OK');
}

// Run the script
generateUtilityTypesFile();