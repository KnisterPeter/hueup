import { computed, observable } from "mobx";
import { objectToUrl, urlToObject } from "../../common/url";
import { Groups, groupsFromApi } from "./groups";
import { Lights, lightsFromApi } from "./lights";
import { NavigationStore, Routes } from "./navigation";

const appId = window.location.host !== "localhost:1234" ? "hueup" : "hueup-dev";

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
  private data: Bridge;

  @computed
  public get id(): string {
    return this.data.id;
  }

  @computed
  public get internalipaddress(): string {
    return this.data.internalipaddress;
  }

  @computed
  public get username(): string | undefined {
    return this.data.username;
  }

  public set username(username: string | undefined) {
    this.data.username = username;
  }

  @computed
  public get csrfToken(): string | undefined {
    return this.data.csrfToken;
  }

  public set csrfToken(csrfToken: string | undefined) {
    this.data.csrfToken = csrfToken;
  }

  constructor(data: Bridge, private navigation: NavigationStore) {
    this.data = data;
  }

  public async startAuth(): Promise<void> {
    this.csrfToken = (function char(n: number): string {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      return (
        chars[Math.floor(Math.random() * chars.length)] +
        (n > 0 ? char(n - 1) : "")
      );
    })(32);

    const urlResponse = await fetch(
      `/api/auth/url?${objectToUrl({
        appid: appId,
        state: this.csrfToken
      })}`
    );
    const urlData: { url: string } = await urlResponse.json();

    window.location.href = urlData.url;
  }

  public async continueAuth(): Promise<void> {
    const params = urlToObject(window.location.search);
    if (!params.code) {
      this.navigation.to = Routes["/authorize"];
      return;
    }

    if (params.state !== this.csrfToken) {
      console.warn("Invalid csrf token detected");
      this.csrfToken = undefined;
      this.navigation.to = Routes["/"];
      return;
    }
    this.csrfToken = undefined;

    const code = params.code;

    const tokenResponse = await fetch(
      `/api/auth/token?${objectToUrl({
        appid: appId,
        code
      })}`
    );

    if (tokenResponse.status !== 200) {
      this.navigation.to = Routes["/authorize"];
      return;
    }

    const data: { username: string } = await tokenResponse.json();
    this.username = data.username;

    this.navigation.to = Routes["/overview"];
  }

  public async loadConfig(): Promise<BridgeConfig> {
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/config`,
      {
        mode: "cors"
      }
    );
    return await response.json();
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

  public async loadGroups(): Promise<Groups> {
    const response = await fetch(`/api/groups/list?username=${this.username}`);
    return groupsFromApi(await response.json());
  }

  public async setGroupState(
    id: string,
    state: { on: boolean }
  ): Promise<void> {
    const response = await fetch(
      `/api/groups/action?username=${this.username}&id=${id}`,
      {
        method: "PUT",
        body: JSON.stringify(state)
      }
    );
    return await response.json();
  }
}
