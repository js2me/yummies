import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";
import { resolve } from 'path';

import tsconfig from "./tsconfig.json";
import packageJson from "./package.json";

const entries = Object.entries(tsconfig.compilerOptions.paths).map(([libName, paths]) => {
  return {
    libName,
    entryName: paths[0].replace('/index.ts', '').replace('.ts', '').replace('./src/', ''),
    entryPath: resolve(__dirname, paths[0]),
  }
})


export default defineConfig({
	plugins: [
		// @ts-ignore
		react({
			tsDecorators: true,
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
		coverage: {
			provider: "istanbul", // or 'v8'
			include: ["src"],
			reporter: ["text", "text-summary", "html"],
			reportsDirectory: "./coverage",
		},
	},
  resolve: {
    alias: Object.assign({}, ...entries.map(entry => {
      return {
        [entry.libName]: entry.entryPath,
      }
    })),
  },
});
