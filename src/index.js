const clog = console.log;
const local_version = "v" + chrome.runtime.getManifest().version;

let indie_button = document.getElementById("indie-button");
let group_button = document.getElementById("group-button");
let comments_button = document.getElementById("comments-button");

indie_button.addEventListener("click", () =>
  chrome.runtime.sendMessage({ command: "grade_indie" })
);

group_button.addEventListener("click", () =>
  chrome.runtime.sendMessage({ command: "grade_group" })
);

comments_button.addEventListener("click", () =>
  chrome.runtime.sendMessage({ command: "grade_comments" })
);

const thereIsNewVersion = async () => {
  let raw_data = await fetch("https://api.github.com/repos/Kunniii/edn_auto_ext/releases/latest");
  let github_data = await raw_data.json();
  let git_version = github_data.tag_name;
  return [git_version != local_version, git_version];
};

(async () => {
  document.getElementById("version").innerText = local_version;
  let [yes, git_version] = await thereIsNewVersion();
  if (yes) {
    document.getElementById("new-version").prepend(`New version found: ${git_version}`);
    document.getElementById("new-version").classList.remove("hidden");
  } else {
    document.getElementById("latest-version").innerHTML = "Latest version!";
  }
})();
