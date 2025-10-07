#!/usr/bin/env tsx


import { readFileSync } from "fs";
import { resolve } from "path";
import { postBuildScript } from "sborshik/post-build-script";

console.log(process.cwd())

const tsconfig = JSON.parse(readFileSync(resolve(process.cwd(), './tsconfig.json')).toString())

function prepareDist() {
  postBuildScript({
    buildDir: 'dist',
    rootDir: '.',
    srcDirName: 'src',
    useBuildDirForExportsMap: true,
    filterExportsPathFn: (path) => {
      return path.startsWith('~');
    },
    addRequireToExportsMap: true,
    filesToCopy: ['LICENSE', 'README.md'],
  })
  
  console.log('Dist prepared OK');
}

// Run the script
prepareDist();