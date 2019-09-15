import { NowResponse } from "@now/node";

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
