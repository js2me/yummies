import { postBuildScript, publishScript } from 'js2me-exports-post-build-script';

postBuildScript({
  buildDir: 'dist',
  rootDir: '.',
  srcDirName: 'src',
  filesToCopy: ['LICENSE', 'README.md', 'assets'],
  updateVersion: process.env.PUBLISH_VERSION,
  onDone: (versionsDiff, { $ }, packageJson, { targetPackageJson }) => {
    $('pnpm test');
    $(`cp dist/utils/types.d.ts dist/utility-types.d.ts`);
    $(`sed -i 's/^export type/type/' dist/utility-types.d.ts`);

    if (process.env.PUBLISH) {
      publishScript({
        nextVersion: versionsDiff?.next ?? packageJson.version,
        currVersion: versionsDiff?.current,
        publishCommand: 'pnpm publish',
        commitAllCurrentChanges: true,
        createTag: true,
        githubRepoLink: 'https://github.com/js2me/yummies',
        cleanupCommand: 'pnpm clean', 
        targetPackageJson
      })
    }
  }
});

