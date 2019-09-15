import { NowRequest, NowResponse } from "@now/node";

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
