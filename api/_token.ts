import { NowRequest, NowResponse } from "@now/node";

export const withToken = (
  handler: (
    req: NowRequest,
    res: NowResponse,
    accessToken: string,
    refreshToken: string
  ) => void | Promise<void>
) => async (req: NowRequest, res: NowResponse) => {
  const accessToken = req.cookies.at;
  if (!accessToken) {
    res.status(401);
    res.end();
    return;
  }

  const refreshToken = req.cookies.rt;
  if (!refreshToken) {
    res.status(401);
    res.end();
    return;
  }

  await handler(req, res, accessToken, refreshToken);
};
