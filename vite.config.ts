import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

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
  appType: 'spa',
  build: {
    minify: 'esbuild',
    sourcemap: true,
    lib: {
      entry:  Object.assign({}, ...entries.map(entry => ({ [entry.entryName]: entry.entryPath }))), 
      formats: ['es', 'cjs'],
    },
    rollupOptions :{
      external: [...entries.map(entry => entry.libName), ...Object.keys(packageJson.peerDependencies), ...Object.keys(packageJson.dependencies)], 
      output: {
        chunkFileNames: '~[name]-[hash].js',
      }
    }
  },
  resolve: {},
  plugins: [dts()]
})
