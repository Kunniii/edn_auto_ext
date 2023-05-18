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

document.getElementById("version").innerText = local_version;
