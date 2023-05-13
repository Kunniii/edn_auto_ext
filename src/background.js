const clog = console.log;

let ednTabId = 0;

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.set({ currentURL: tab.url });
});

const extensionView = {
  window: null,
  tab: null,
  find() {
    return new Promise((resolve) => {
      chrome.windows.getAll({ populate: true }, (windows) => {
        for (let window of windows) {
          for (let tab of window.tabs) {
            if (
              tab.url.includes(`chrome-extension://${chrome.i18n.getMessage("@@extension_id")}`)
            ) {
              this.window = window;
              this.tab = tab;
              resolve(true);
              return;
            }
          }
        }
        resolve(false);
      });
    });
  },
  focus() {
    chrome.windows.update(this.window.id, { focused: true });
    chrome.tabs.update(this.tab.id, { active: true });
  },
};

async function launchExtension(tab) {
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) return;
  if (!tab.url.includes("fu-edunext.fpt.edu.vn")) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["alert.js"],
    });
    return;
  } else {
    ednTabId = tab.id;
  }
  clog(ednTabId);
  await extensionView.find().then((found) => {
    if (found) {
      extensionView.focus();
    } else {
      chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        type: "popup",
        focused: true,
        height: 300,
        width: 400,
      });
    }
  });
}

chrome.action.onClicked.addListener(launchExtension);

chrome.runtime.onMessage.addListener((request) => {
  if (!ednTabId) {
    alert("Please reload web page and reload extension!");
    return;
  }
  if (request.command) {
    let command = request.command;
    if (command == "grade_indie") {
      chrome.scripting.executeScript({
        target: { tabId: ednTabId },
        files: ["gradeIndie.js"],
      });
    }
    if (command == "grade_group") {
      chrome.scripting.executeScript({
        target: { tabId: ednTabId },
        files: ["gradeGroup.js"],
      });
    }
  }
});
