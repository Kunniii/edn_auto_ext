import { message, response } from "./utils/types";

function handlePortConnection(port) {
  if (port.name === "ednv3") {
    console.log("Connected!");
    chrome.runtime.onMessage.addListener((msg: message, sender, sendResponse) => {
      let command = msg.command;
      switch (command) {
        case "get_token":
          port.postMessage(msg);
          port.onMessage.addListener((response: response) => {
            sendResponse(response);
          });
          break;

        case "get_url":
          chrome.tabs.query({ active: true }, function (tab) {
            var url = tab[0].url || "";
            let msgResponse: response = { data: url, ok: true };
            sendResponse(msgResponse);
          });
          break;

        case "make_request":
          port.postMessage(msg);
          port.onMessage.addListener((response: response) => {
            sendResponse(response);
          });
          break;

        default:
          break;
      }
      return true;
    });
  }
}

chrome.runtime.onConnect.addListener(handlePortConnection);
