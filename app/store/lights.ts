import { v3 } from "node-hue-api";
import { Alert, Colormode, Effect } from "./common-types";

export interface Light {
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
}

export interface Lights {
  // todo
  [id: string]: any;
}

export function lightsFromApi(raw: unknown): Lights {
  if (!Array.isArray(raw)) {
    throw new Error("Expect an array from the api");
  }

  const data = raw.map(entry => v3.model.createFromJson(entry));

  return data.reduce((o, g) => {
    // todo
    o[g.id] = g as any;
    return o;
  }, {} as Lights);
}
