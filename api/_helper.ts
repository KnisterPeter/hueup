import { NowRequest, NowResponse } from "@now/node";
import fetch, { Response } from "node-fetch";
import { API_BASE } from "./_config";

export function copyHeaders(src: Response, dest: NowResponse): void {
  src.headers.forEach((value, key) => {
    dest.setHeader(key, value);
  });
}

export function serverError(res: NowResponse, message: string): void {
  console.error(message);
  res.status(500);
  res.end();
}

export function setCookies(
  res: NowResponse,
  ...cookies: {
    name: string;
    value: string;
    maxAge?: string;
    secure?: boolean;
  }[]
): void {
  const secure = process.env.NODE_ENV !== "development";

  res.setHeader(
    "Set-Cookie",
    cookies.map(
      cookie =>
        `${cookie.name}=${cookie.value}; Path=/${
          cookie.maxAge ? `; Max-Age=${cookie.maxAge}` : ""
        }; HttpOnly; SameSite=Strict${
          cookie.secure && secure ? "; Secure" : ""
        }`
    )
  );
}

export const hueApiFactory = (accessToken: string) => async (
  path: string,
  method: string,
  body?: any
) => {
  const response = await fetch(`${API_BASE}${path}`, {
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

export const requireAccessToken = (
  handler: (
    req: NowRequest,
    res: NowResponse,
    accessToken: string
  ) => void | Promise<void>
) => async (req: NowRequest, res: NowResponse) => {
  const accessToken = req.cookies.at;
  if (!accessToken) {
    res.status(401);
    res.end();
    return;
  }

  await handler(req, res, accessToken);
};

export const handleError = (
  handler: (req: NowRequest, res: NowResponse) => void | Promise<void>
) => async (req: NowRequest, res: NowResponse) => {
  try {
    await handler(req, res);
  } catch (e) {
    console.error("Failed to handle request", e);
    res.status(500);
    res.end();
  }
};
