const clog = console.log;

let indie_button = document.getElementById("indie-button");
let group_button = document.getElementById("group-button");

indie_button.addEventListener("click", () =>
  chrome.runtime.sendMessage({ command: "grade_indie" })
);

group_button.addEventListener("click", () =>
  chrome.runtime.sendMessage({ command: "grade_group" })
);
