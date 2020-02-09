import { NowRequest, NowResponse } from "@now/node";
import { v3 } from "node-hue-api";
import { asString } from "./_query";
import { withToken } from "./_token";

export const secrets = () => {
  const clientId = process.env.CLIENTID;
  if (!clientId) {
    throw new Error("No clientId found");
  }

  const clientSecret = process.env.CLIENTSECRET;
  if (!clientSecret) {
    throw new Error("No clientSecret found");
  }

  return {
    clientId,
    clientSecret
  };
};

export const fromAuthorizationCode = async (appId: string, code: string) => {
  const { clientId, clientSecret } = secrets();

  const remoteBootstrap = v3.api.createRemote(clientId, clientSecret);

  return await remoteBootstrap.connectWithCode(
    code,
    undefined,
    10 * 1000,
    appId
  );
};

export const apiFactory = async (
  accessToken: string,
  refreshToken: string,
  username?: string
) => {
  const { clientId, clientSecret } = secrets();

  const bootstrap = v3.api.createRemote(clientId, clientSecret);
  return await bootstrap.connectWithTokens(
    accessToken,
    refreshToken,
    username,
    10 * 1000
  );
};

type PromiseResult<T> = T extends Promise<infer U> ? U : never;

export type Api = PromiseResult<ReturnType<typeof apiFactory>>;

export const withApi = (
  handler: (req: NowRequest, res: NowResponse, api: Api) => void | Promise<void>
) =>
  withToken(
    async (req: NowRequest, res: NowResponse, accessToken, refreshToken) => {
      const username = asString(req, "username");

      await handler(
        req,
        res,
        await apiFactory(accessToken, refreshToken, username)
      );
    }
  );
