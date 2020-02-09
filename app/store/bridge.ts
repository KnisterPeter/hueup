import { computed, observable } from "mobx";
import { objectToUrl, urlToObject } from "../../common/url";
import { Groups, groupsFromApi } from "./groups";
import { Lights, lightsFromApi } from "./lights";
import { navigateTo, Route } from "./navigation";
import { createStore } from "./_helper";

const appId = window.location.host !== "localhost:1234" ? "hueup" : "hueup-dev";

function randomChars(n: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return (
    chars[Math.floor(Math.random() * chars.length)] +
    (n > 0 ? randomChars(n - 1) : "")
  );
}

export interface BridgeConfig {
  name: string;
  whitelist: {
    [username: string]: {
      "create date": string;
      "last use date": string;
      name: string;
    };
  };
}

export class Bridge {
  @observable
  private _username: string | undefined;

  @computed
  public get username(): string | undefined {
    return this._username;
  }

  constructor() {
    this._username = window.localStorage.getItem("username") || undefined;
  }

  public async startAuth(): Promise<void> {
    const csrfToken = randomChars(32);
    window.localStorage.setItem("csrf-token", csrfToken);

    const urlResponse = await fetch(
      `/api/auth/url?${objectToUrl({
        appid: appId,
        state: csrfToken
      })}`
    );
    const urlData: { url: string } = await urlResponse.json();

    window.location.href = urlData.url;
  }

  public async continueAuth(): Promise<void> {
    const params = urlToObject(window.location.search);
    if (!params.code) {
      navigateTo(Route["/authorize"]);
      return;
    }

    const csrfToken = window.localStorage.getItem("csrf-token") || undefined;

    if (params.state !== csrfToken) {
      console.warn("Invalid csrf token detected");
      window.localStorage.removeItem("csrf-token");
      navigateTo(Route["/"]);
      return;
    }
    window.localStorage.removeItem("csrf-token");

    const code = params.code;

    const tokenResponse = await fetch(
      `/api/auth/token?${objectToUrl({
        appid: appId,
        code
      })}`
    );

    if (tokenResponse.status !== 200) {
      navigateTo(Route["/authorize"]);
      return;
    }

    const data: { username: string } = await tokenResponse.json();
    this._username = data.username;
    window.localStorage.setItem("username", data.username);

    navigateTo(Route["/overview"]);
  }

  public async loadConfig(): Promise<BridgeConfig> {
    return {
      name: "remote",
      whitelist: {}
    };
    // const response = await fetch(
    //   `http://${this.internalipaddress}/api/${this.username}/config`,
    //   {
    //     mode: "cors"
    //   }
    // );
    // return await response.json();
  }

  public async deleteUser(): Promise<void> {
    window.open("https://account.meethue.com/apps", "_blank");
  }

  public async loadLights(): Promise<Lights> {
    const response = await fetch(`/api/lights/list?username=${this.username}`);
    return lightsFromApi(await response.json());
  }

  public async setLightState(
    id: string,
    state: { on: boolean }
  ): Promise<void> {
    const response = await fetch(
      `/api/lights/state?username=${this.username}&id=${id}`,
      {
        method: "PUT",
        body: JSON.stringify(state)
      }
    );
    return await response.json();
  }
}

export const { Provider: BridgeProvider, useStore: useBridge } = createStore(
  new Bridge()
);

export const { Provider: GroupsProvider, useStore: useGroups } = createStore<
  Groups | undefined
>(undefined);

export async function fetchGroups(username: string): Promise<Groups> {
  const response = await fetch(`/api/groups/list?username=${username}`);
  const data = await response.json();
  return groupsFromApi(data);
}

export async function updateGroupState(
  username: string,
  id: string,
  state: { on: boolean }
): Promise<void> {
  const response = await fetch(
    `/api/groups/action?username=${username}&id=${id}`,
    {
      method: "PUT",
      body: JSON.stringify(state)
    }
  );
  await response.json();
}

export const { Provider: LightsProvider, useStore: useLights } = createStore<
  Lights | undefined
>(undefined);

export async function fetchLights(username: string): Promise<Lights> {
  const response = await fetch(`/api/lights/list?username=${username}`);
  const data = await response.json();
  return lightsFromApi(data);
}
