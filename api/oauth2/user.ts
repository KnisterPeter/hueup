import { handleError, hueApiFactory, requireAccessToken } from "../_helper";

export default handleError(
  requireAccessToken(async (_, res, accessToken) => {
    const hueApi = hueApiFactory(accessToken);

    await hueApi("/0/config", "PUT", { linkbutton: true });

    const username = await hueApi("/", "POST", { devicetype: "hueup" });

    res.status(200);
    res.json(username);
  })
);
