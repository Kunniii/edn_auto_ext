export type user = {
  _id: string;
  name: string;
  email: string;
  status: string;
  userId: number;
  rollNumber: string;
  [key: string]: string | boolean | number;
};

export type message = {
  command: "make_request" | "get_token" | "get_url";
  fetchConfigs?: {
    url: string;
    configs: fetchConfig;
    params?: Object;
  };
};

export type response = {
  data: any;
  ok: boolean;
};

export interface fetchConfig extends RequestInit {
  method: "GET" | "POST";
  headers: {
    [key: string]: string;
  };
  [key: string]: any;
}

export type state = "pending" | "failed" | "ok" | "static" | "disable";
