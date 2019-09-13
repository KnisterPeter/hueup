import { computed, observable } from "mobx";
import { objectToUrl, urlToObject } from "../../common/url";
import { NavigationStore, Routes } from "./navigation";

const appConfig = () => {
  const configs = {
    "localhost:1234": {
      clientid: "h9CI9pjTNY9wuT5NYxzQBBFShsqCYQuw",
      appid: "hueup-dev"
    },
    "hueup.matrixweb.de": {
      clientid: "gcz46Ozcl1o5XJKz8F1v5NEwICiQ5ty8",
      appid: "hueup"
    }
  } as const;

  return window.location.host !== "localhost:1234"
    ? configs["hueup.matrixweb.de"]
    : configs["localhost:1234"];
};

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

type Effect = "none" | "colorloop";
type Alert = "none" | "select" | "lselect";
type Colormode = "hs" | "xy" | "ct";

export interface Lights {
  [id: string]: {
    state: {
      on: boolean;
      bri: number;
      hue: number;
      sat: number;
      effect: Effect;
      xy: [number, number];
      ct: number;
      alert: Alert;
      colormode: Colormode;
      mode: "homeautomation";
      reachable: boolean;
    };
    swupdate: { state: "noupdates"; lastinstall: "2019-07-06T20:56:08" };
    type: string;
    name: string;
    modelid: string;
    manufacturername: string;
    productname: string;
    capabilities: {
      certified: boolean;
      control: {
        mindimlevel: number;
        maxlumen: number;
        colorgamuttype: "C";
        colorgamut: [[0.6915, 0.3083], [0.17, 0.7], [0.1532, 0.0475]];
        ct: { min: 153; max: 500 };
      };
      streaming: { renderer: boolean; proxy: boolean };
    };
    config: {
      archetype: "walllantern";
      function: "mixed";
      direction: "omnidirectional";
      startup: { mode: "powerfail"; configured: true };
    };
    uniqueid: string;
    swversion: string;
    swconfigid: string;
    productid: string;
  };
}

export interface Groups {
  [id: string]: {
    name: string;
    lights: string[];
    sensors: [];
    type: "Room" | "Zone";
    state: { all_on: boolean; any_on: boolean };
    recycle: boolean;
    class:
      | "Living room"
      | "Kitchen"
      | "Dining"
      | "Bedroom"
      | "Kids bedroom"
      | "Bathroom"
      | "Nursery"
      | "Recreation"
      | "Office"
      | "Gym"
      | "Hallway"
      | "Toilet"
      | "Front door"
      | "Garage"
      | "Terrace"
      | "Garden"
      | "Driveway"
      | "Carport"
      | "Other"
      | "Home"
      | "Downstairs"
      | "Upstairs"
      | "Top floor"
      | "Attic"
      | "Guest room"
      | "Staircase"
      | "Lounge"
      | "Man cave"
      | "Computer"
      | "Studio"
      | "Music"
      | "TV"
      | "Reading"
      | "Closet"
      | "Storage"
      | "Laundry room"
      | "Balcony"
      | "Porch"
      | "Barbecue"
      | "Pool";
    action: {
      on: boolean;
      bri: number;
      hue: number;
      sat: number;
      effect: Effect;
      xy: [number, number];
      ct: number;
      alert: Alert;
      colormode: Colormode;
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

  public startAuth(): void {
    this.csrfToken = (function char(n: number): string {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      return (
        chars[Math.floor(Math.random() * chars.length)] +
        (n > 0 ? char(n - 1) : "")
      );
    })(32);

    window.location.href = `https://api.meethue.com/oauth2/auth?${objectToUrl({
      ...appConfig(),
      deviceid: "hueup",
      devicename: `Browser/App (${navigator.platform})`,
      state: this.csrfToken!,
      response_type: "code"
    })}`;
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
      `/api/oauth2/token?${objectToUrl({
        clientid: appConfig().clientid,
        code
      })}`,
      {
        method: "POST",
        credentials: "same-origin"
      }
    );

    if (tokenResponse.status === 401) {
      this.navigation.to = Routes["/authorize"];
      return;
    }

    const userResponse = await fetch("/api/oauth2/user", {
      method: "POST"
    });

    if (userResponse.status !== 200) {
      this.navigation.to = Routes["/"];
      return;
    }

    const data: [{ success: { username: string } }] = await userResponse.json();
    this.username = data[0].success.username;

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
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/lights`,
      {
        mode: "cors"
      }
    );
    return await response.json();
  }

  public async setLightState(
    id: string,
    state: { on: boolean }
  ): Promise<void> {
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/lights/${id}/state`,
      {
        mode: "cors",
        method: "PUT",
        body: JSON.stringify(state)
      }
    );
    return await response.json();
  }

  public async loadGroups(): Promise<Groups> {
    const response = await fetch(`/api/groups/list?username=${this.username}`);
    return await response.json();
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
