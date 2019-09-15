import { NowRequest, NowResponse } from "@now/node";
import { Api, withApi } from "./_api";
import { handleError } from "./_error";

export const fn = (
  handler: (req: NowRequest, res: NowResponse, api: Api) => void | Promise<void>
) =>
  handleError(
    withApi(async (req: NowRequest, res: NowResponse, api) => {
      await handler(req, res, api);
    })
  );
