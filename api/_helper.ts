import fetch from "node-fetch";
import { BRIDGE_BASE } from "./_config";

export const hueApiFactory = (accessToken: string) => async (
  path: string,
  method: string,
  body?: any
) => {
  const response = await fetch(`${BRIDGE_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status !== 200) {
    throw new Error(
      `API call to '${path}' failed with: ${await response.text()}`
    );
  }

  return response.json();
};
