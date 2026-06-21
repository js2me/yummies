/**
 * ---header-docs-section---
 * # yummies/types
 *
 * ## Description
 *
 * This module collects **TypeScript-only** helpers: `ValueOf`, nullable aliases, branded types, and
 * patterns for props and generics. Nothing here exists at runtime — use `import type` so bundlers
 * drop the imports entirely. The same ideas are also published as **ambient** globals under a
 * separate entry (see below) when you want types in scope without repeating imports in every file.
 *
 * ## `yummies/types.global`
 *
 * Use this subpath when you prefer **global** declarations (no per-file imports). After installing
 * the package, reference the built `.d.ts` bundle — typically via a side-effect import that pulls
 * ambient types into the compilation unit:
 *
 * ```ts
 * import "yummies/types.global";
 * ```
 *
 * Or list it under `compilerOptions.types` in **`tsconfig.json`** so `tsc` loads it for the project:
 *
 * ```json
 * {
 *   "compilerOptions": {
 *     "types": ["yummies/types.global"]
 *   }
 * }
 * ```
 *
 * ## `yummies/types` (library)
 *
 * Prefer this entry when you want **explicit**, traceable imports at each call site (tree-shaking
 * friendly and clearer in reviews). The root package may re-export some symbols, but
 * **`yummies/types`** is the dedicated surface for type-only utilities.
 *
 * ```ts
 * import type { AnyObject, Maybe } from "yummies/types";
 * ```
 */

export * from './types.js';
