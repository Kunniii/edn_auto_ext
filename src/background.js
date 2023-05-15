const clog = console.log;

let ednTabId = 0;

const last_window_info = {
  location_default: {
    height: 350,
    width: 400,
    top: 100,
    left: 100,
  },
};

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

function getLastWindowLocation() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["lastLocation"], ({ lastLocation }) => {
      if (lastLocation) {
        resolve(lastLocation);
      } else {
        resolve(null);
      }
    });
  });
}

async function launchExtension(tab) {
  let res = await getLastWindowLocation();
  let location;
  if (res == null) {
    location = last_window_info.location_default;
  } else {
    location = res;
  }
  if (tab.url.startsWith("chrome") || tab.url.startsWith("edge")) return;
  if (!tab.url.includes("fu-edunext.fpt.edu.vn/course/activity/question")) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["alert.js"],
    });
    return;
  } else {
    ednTabId = tab.id;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["ready.js"],
    });
  }
  await extensionView.find().then((found) => {
    if (found) {
      extensionView.focus();
    } else {
      chrome.windows.create(
        {
          url: chrome.runtime.getURL("index.html"),
          type: "popup",
          focused: true,
          ...location,
        },
        (w) => {
          extensionView.window = w;
        }
      );
    }
  });
}

chrome.windows.onBoundsChanged.addListener((window) => {
  if (extensionView.window) {
    if (extensionView.window.id === window.id) {
      let location = {
        width: 400,
        height: 350,
        top: window.top,
        left: window.left,
      };
      chrome.storage.local
        .set({ lastLocation: location })
        .then(() => {
          console.log("Window location saved!!");
        })
        .catch(() => {
          console.log("Error when saving window location");
        });
    }
  }
});

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
