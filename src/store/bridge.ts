import { action, computed, observable } from "mobx";

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
  public get clientkey(): string | undefined {
    return this.data.clientkey;
  }

  public set clientkey(clientkey: string | undefined) {
    this.data.clientkey = clientkey;
  }

  constructor(data: Bridge) {
    this.data = data;
  }

  @action
  public async authorize(): Promise<void> {
    const response = await fetch(`http://${this.internalipaddress}/api`, {
      mode: "cors",
      method: "POST",
      body: JSON.stringify({
        devicetype: "hueup#devicename",
        generateclientkey: true
      })
    });

    const data: {
      success?: { username: string; clientkey?: string };
      error?: { type: number };
    }[] = await response.json();

    if (data.length === 0) {
      console.log("no response");
      return;
    }
    if (data[0].error) {
      if (data[0].error.type === 101) {
        console.log("press button on bridge");
      } else {
        console.log("error");
      }
    } else if (data[0].success) {
      this.username = data[0].success.username;
      this.clientkey = data[0].success.clientkey;
    } else {
      console.log(data);
    }
  }

  @action
  public async loadConfig(): Promise<BridgeConfig> {
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/config`,
      {
        mode: "cors"
      }
    );
    return await response.json();
  }

  @action
  public async deleteUser(): Promise<void> {
    window.open("https://account.meethue.com/apps", "_blank");
  }

  @action
  public async loadLights(): Promise<Lights> {
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/lights`,
      {
        mode: "cors"
      }
    );
    return await response.json();
  }

  @action
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

  @action
  public async loadGroups(): Promise<Groups> {
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/groups`,
      {
        mode: "cors"
      }
    );
    return await response.json();
  }

  @action
  public async setGroupState(
    id: string,
    state: { on: boolean }
  ): Promise<void> {
    const response = await fetch(
      `http://${this.internalipaddress}/api/${this.username}/groups/${id}/action`,
      {
        mode: "cors",
        method: "PUT",
        body: JSON.stringify(state)
      }
    );
    return await response.json();
  }
}
