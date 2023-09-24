# Contribute to this project

This is a note for myself or someone to contribute to this project. In this section, there will be some workflows for releasing, devloping, or publish this prodcut.

## Developing

This project use NodeJS with Yarn/Bun for package managing.

For each new feature, please create a branch with prefix of `dev`.

By pushing to the branch with prefix `dev`, the workflow `Dev Workflow` will be executed.

Make sure that the build process is OK.

## Pre Release

When you want create a pre-release, create a tag with prefix of `pre-v` and the version number.

Update file [PRE-RELEASE.md]('./PRE-RELEASE.md' ) for the release message.

Then push the code.

When the build is success, the branch `nightly` will update with the new content.

## Release a Stable build

When you want create a stable build, create a tag with the prefix of `v` and the version number.

Update file [RELEASE.md]('./RELEASE.md' ) for the release message.

Then push the code.

When the build is success, the branch `stable` will update with the new content.

## Publish to Chrome Store

When releasing a statble build, it will automatically upload the new version to Chrome Store.
