const { readFileSync, writeFileSync } = require("fs");
const { spawn } = require("child_process");
const clog = console.log;

function newestVersion(v1, v2) {
  if (!v1) {
    return v2;
  }
  if (!v2) {
    return v1;
  }
  [v11, v12, v13] = v1.split(".").map((n) => {
    return parseInt(n);
  });

  [v21, v22, v23] = v2.split(".").map((n) => {
    return parseInt(n);
  });

  if (v11 != v21) {
    if (v11 > v21) {
      return v1;
    } else {
      return v2;
    }
  }
  if (v12 != v22) {
    if (v12 > v22) {
      return v1;
    } else {
      return v2;
    }
  }
  if (v13 != v23) {
    if (v13 > v23) {
      return v1;
    } else {
      return v2;
    }
  }
  return v1;
}

clog("\n 📜 Checking current package version... ");
let packageJson = JSON.parse(readFileSync("./package.json"));
let pkg_version = packageJson.version;
clog("    📦 ", pkg_version);
clog(" 📜 Checking newest git tag... ");
spawn("git", ["tag"]).stdout.on("data", (b) => {
  let dataString = b.toString();
  let tags = dataString.trim().split("\n");
  let latest_tag = tags.at(-1).replace("v", "");
  clog("    🛸 ", latest_tag);
  if (pkg_version == latest_tag) {
    clog(" ✨ Versions are up to date!\n");
  } else {
    let newest_version = newestVersion(pkg_version, latest_tag);
    if (latest_tag == newest_version) {
      clog(" 🍥 Updating version in package.json...");
      packageJson["version"] = latest_tag;
      writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
      clog(" 👍 Done!");
    } else {
      clog(" 🌡️ Looks like package version is latest! To update git tags:");
      clog(`\n   🐟 git tag -a ${newest_version}\n`);
    }
  }
});
