#!/usr/bin/env tsx

import { $ } from "js2me-exports-post-build-script/utils";

function generateUtilityTypesFile() {
  $(`cp dist/utils/types.d.ts utility-types.d.ts`, undefined, true);
  $(`sed -i 's/^export type/type/' utility-types.d.ts`, undefined, true);
}

// Run the script
generateUtilityTypesFile();