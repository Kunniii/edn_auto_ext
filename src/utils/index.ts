import { message } from "./types";
import moment from "moment-timezone";
import { HmacSHA256 } from "crypto-js";
import * as Hex from "crypto-js/enc-hex.js";

export const utils = {
  getTimeStamp() {
    const time = moment.tz("Asia/Ho_Chi_Minh").add(1, "minute");
    const now = time.format("YYYY-MM-DD HH:mm:ss");
    const then = time.add(1, "minute").add(30, "seconds").format("YYYY-MM-DD HH:mm:ss");
    return { now, then };
  },

  getRequestHeaders(endpoint, token) {
    const { date, expiration, hash } = this.genChecksum(endpoint);
    return {
      origin: "https://fu-edunext.fpt.edu.vn/",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "X-Checksum": hash,
      "X-Date": date,
      "X-Expiration": expiration,
    };
  },

  stripEndpoint(endpoint: string) {
    const apiRegex = /(\/api\/.*)/;
    const versionRegex = /(^v1\/.*)/;
    let apiMatch;

    apiMatch = endpoint.match(apiRegex) || endpoint.match(versionRegex);

    const apiPath = apiMatch ? "" + apiMatch[1] : "";
    return apiPath.replace(/[?&][^=?&]+=[^&]+/g, "");
  },

  genChecksum(endpoint: string) {
    const KEY = "331e4b21-a470-4833-89e0-db9ba605e8c7";
    const { now, then } = this.getTimeStamp();
    endpoint = this.stripEndpoint(endpoint);
    const data = `${endpoint}_${now}_${then}`;
    const hmac = HmacSHA256(data, KEY).toString(Hex);
    return {
      date: now,
      expiration: then,
      hash: hmac,
    };
  },
  base64decode(str: string) {
    const paddingLength = (4 - (str.length % 4)) % 4;
    const paddedBase64Url = str + "===".slice(0, paddingLength);
    const base64 = paddedBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const text = new TextDecoder().decode(new Uint8Array([...decoded].map((c) => c.charCodeAt(0))));
    return text;
  },

  get(endpoint: string, token: string, params: Object | undefined = undefined) {
    const message: message = {
      command: "make_request",
      fetchConfigs: {
        url: endpoint,
        configs: {
          method: "GET",
          headers: utils.getRequestHeaders(endpoint, token),
        },
        params: params,
      },
    };
    return chrome.runtime.sendMessage(message);
  },
  post(
    endpoint: string,
    token: string,
    params: Object | undefined = undefined,
    body: string | undefined = undefined
  ) {
    const message: message = {
      command: "make_request",
      fetchConfigs: {
        url: endpoint,
        configs: {
          method: "POST",
          headers: utils.getRequestHeaders(endpoint, token),
          body: body,
        },
        params: params,
      },
    };
    return chrome.runtime.sendMessage(message);
  },
};
