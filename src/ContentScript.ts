import { message, fetchConfig, response, user } from "./utils/types";

function request(endpoint: string, configs: fetchConfig, params) {
  if (params) {
    return fetch(endpoint + "?" + new URLSearchParams(params), { ...configs });
  } else {
    return fetch(endpoint, { ...configs });
  }
}

function getToken() {
  let token = localStorage.getItem("token");
  return token ? token : "";
}

const port = chrome.runtime.connect({ name: "ednv3" });
port.onMessage.addListener(async function (msg: message, sender) {
  const command = msg.command;
  const fetchConfigs = msg.fetchConfigs;
  if (command) {
    let res: response;
    console.info("Command: ", command);

    switch (command) {
      case "get_token":
        res = { data: getToken(), ok: true };
        port.postMessage(res);
        break;
      case "make_request":
        if (fetchConfigs?.url && fetchConfigs?.configs) {
          const configs = fetchConfigs.configs;
          const endpoint = fetchConfigs.url;
          const params = fetchConfigs.params;

          console.log(`  - ${configs.method}: ${endpoint}`);

          const response = await request(endpoint, configs, params);
          const data = await response.json();
          let res = { data: data, ok: response.ok };
          port.postMessage(res);
        }
      default:
        break;
    }
  }
});
