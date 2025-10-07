#!/usr/bin/env tsx


import { postBuildScript } from "sborshik/post-build-script";

function prepareDist() {
  postBuildScript({
    buildDir: 'dist',
    rootDir: '.',
    srcDirName: 'src',
    useBuildDirForExportsMap: true,
    filterExportsPathFn: (path) => {
      return path.startsWith('~');
    },
    filesToCopy: ['LICENSE', 'README.md'],
  })
  
  console.log('Dist prepared OK');
}

// Run the script
prepareDist();