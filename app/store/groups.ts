import { v3 } from "node-hue-api";

export interface ExtendedGroup {
  type: "Room" | "Zone" | "LightGroup";
}

export type GroupType =
  | ReturnType<typeof v3.model.createRoom>
  | ReturnType<typeof v3.model.createZone>
  | ReturnType<typeof v3.model.createLightGroup>;

export interface Groups {
  [id: string]: GroupType & ExtendedGroup;
}

export function groupsFromApi(raw: unknown): Groups {
  if (!Array.isArray(raw)) {
    throw new Error("Expect an array from the api");
  }

  const data: GroupType[] = raw.map(entry => v3.model.createFromJson(entry));
  return data.reduce((o, g) => {
    // todo
    o[g.id] = g as any;
    return o;
  }, {} as Groups);
}
