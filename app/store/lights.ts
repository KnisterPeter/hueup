import { Alert, Colormode, Effect } from "./common-types";
import {
  hasBooleanAttribute,
  hasNumberAttribute,
  hasObjectAttribute,
  hasStringAttribute
} from "./_typeguards";

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
  [id: string]: Light;
}

export function lightsFromApi(raw: unknown): Lights {
  if (!Array.isArray(raw)) {
    throw new Error("Expect an array from the api");
  }
  return raw.reduce(
    (accu, rawLight: unknown) => {
      if (hasNumberAttribute(rawLight, "_id")) {
        console.log("lights", rawLight);
        accu[rawLight._id] = {
          get name(): string {
            if (
              hasObjectAttribute(rawLight, "_rawData") &&
              hasStringAttribute(rawLight._rawData, "name")
            ) {
              return rawLight._rawData.name;
            }
            throw new Error(`No valid attribute 'name' found`);
          },
          get state(): Light["state"] {
            if (hasObjectAttribute(rawLight, "_rawData")) {
              return {
                get on(): boolean {
                  if (
                    hasObjectAttribute(rawLight, "_rawData") &&
                    hasObjectAttribute(rawLight._rawData, "state") &&
                    hasBooleanAttribute(rawLight._rawData.state, "on")
                  ) {
                    return rawLight._rawData.state.on;
                  }
                  throw new Error(`No valid attribute 'on' found`);
                },
                get bri(): number {
                  throw new Error("Unimplemented");
                },
                get hue(): number {
                  throw new Error("Unimplemented");
                },
                get sat(): number {
                  throw new Error("Unimplemented");
                },
                get effect(): Effect {
                  throw new Error("Unimplemented");
                },
                get xy(): [number, number] {
                  throw new Error("Unimplemented");
                },
                get ct(): number {
                  throw new Error("Unimplemented");
                },
                get alert(): Alert {
                  throw new Error("Unimplemented");
                },
                get colormode(): Colormode {
                  throw new Error("Unimplemented");
                },
                get mode(): "homeautomation" {
                  throw new Error("Unimplemented");
                },
                get reachable(): boolean {
                  throw new Error("Unimplemented");
                }
              };
            }
            throw new Error(`No valid attribute 'state' found`);
          }
        };
      }
      return accu;
    },
    {} as Lights
  );
}
