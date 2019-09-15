import { Alert, Colormode, Effect } from "./common-types";
import {
  hasAttribute,
  hasBooleanAttribute,
  hasNumberAttribute,
  hasObjectAttribute,
  hasStringAttribute
} from "./_typeguards";

export interface Group {
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
}

export interface Groups {
  [id: string]: Group;
}

export function groupsFromApi(raw: unknown): Groups {
  if (!Array.isArray(raw)) {
    throw new Error("Expect an array from the api");
  }

  return raw.reduce(
    (accu, rawGroup: unknown) => {
      if (hasNumberAttribute(rawGroup, "_id")) {
        accu[rawGroup._id] = {
          get name(): string {
            if (
              hasObjectAttribute(rawGroup, "_rawData") &&
              hasStringAttribute(rawGroup._rawData, "name")
            ) {
              return rawGroup._rawData.name;
            }
            throw new Error(`No valid attribute 'name' found`);
          },
          get state(): Group["state"] {
            if (
              hasObjectAttribute(rawGroup, "_rawData") &&
              hasAttribute(rawGroup._rawData, "state") &&
              hasBooleanAttribute(rawGroup._rawData.state, "all_on") &&
              hasBooleanAttribute(rawGroup._rawData.state, "any_on")
            ) {
              return {
                get all_on(): boolean {
                  if (
                    hasObjectAttribute(rawGroup, "_rawData") &&
                    hasObjectAttribute(rawGroup._rawData, "state") &&
                    hasBooleanAttribute(rawGroup._rawData.state, "all_on")
                  ) {
                    return rawGroup._rawData.state.all_on;
                  }
                  throw new Error(`No valid attribute 'all_on' found`);
                },
                get any_on(): boolean {
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
    {} as Groups
  );
}
