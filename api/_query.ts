import { NowRequest } from "@now/node";

export const asString = (req: NowRequest, name: string): string => {
  const value = req.query[name];

  if (!value || Array.isArray(value)) {
    throw new Error(`Parameter '${name}' missing`);
  }

  return value;
};
