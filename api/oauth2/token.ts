import { NowRequest, NowResponse } from "@now/node";
import fetch from "node-fetch";
import { objectToUrl } from "../../common/url";
import { serverError, setCookies } from "../_helper";
import {
  calculateDigest,
  digestHeader,
  parseAuthenticateHeader
} from "./_digest";

const clientSecret = process.env.CLIENTSECRET;
if (!clientSecret) {
  throw new Error("No clientSecret found");
}

export default async (req: NowRequest, res: NowResponse) => {
  const clientid = req.query.clientid;
  if (!clientid || Array.isArray(clientid)) {
    return serverError(res, "clientid parameter need to be given once");
  }

  const code = req.query.code;
  if (!code || Array.isArray(code)) {
    return serverError(res, "code parameter need to be given once");
  }

  const authenticateHeader = await startDigestAuthorization(code);
  if (!authenticateHeader) {
    return serverError(res, "No www-authenticate header recieved");
  }

  const digestParams = parseAuthenticateHeader(authenticateHeader);

  const realm = digestParams.get("realm");
  if (!realm) {
    return serverError(res, "realm no found");
  }

  const nonce = digestParams.get("nonce");
  if (!nonce) {
    return serverError(res, "nonce no found");
  }

  const digest = calculateDigest({
    clientid,
    clientSecret,
    verb: "POST",
    path: "/oauth2/token",
    realm,
    nonce
  });

  const authorizationCodeResponse = await fetch(
    `https://api.meethue.com/oauth2/token?${objectToUrl({
      code,
      grant_type: "authorization_code"
    })}`,
    {
      method: "POST",
      headers: {
        Authorization: digestHeader({
          path: "/oauth2/token",
          clientid,
          realm,
          nonce,
          digest
        })
      }
    }
  );

  res.status(authorizationCodeResponse.status);

  if (authorizationCodeResponse.status === 200) {
    const tokens: {
      access_token: string;
      access_token_expires_in: string;
      refresh_token: string;
      refresh_token_expires_in: string;
      token_type: string;
    } = await authorizationCodeResponse.json();

    setCookies(
      res,
      {
        name: "at",
        value: tokens.access_token,
        secure: true,
        maxAge: tokens.access_token_expires_in
      },
      {
        name: "rt",
        value: tokens.refresh_token,
        secure: true,
        maxAge: tokens.refresh_token_expires_in
      }
    );
  }

  res.json({});
};

async function startDigestAuthorization(code: string): Promise<string | null> {
  const nonceResponse = await fetch(
    `https://api.meethue.com/oauth2/token?${objectToUrl({
      code,
      grant_type: "authorization_code"
    })}`,
    {
      method: "POST"
    }
  );

  return nonceResponse.headers.get("www-authenticate");
}
