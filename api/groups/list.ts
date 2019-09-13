import {
  handleError,
  hueApiFactory,
  requireAccessToken,
  serverError
} from "../_helper";

export default handleError(
  requireAccessToken(async (req, res, accessToken) => {
    const hueApi = hueApiFactory(accessToken);

    const username = req.query.username;
    if (!username) {
      return serverError(res, "username missing");
    }

    const response = await hueApi(`/${username}/groups`, "GET");

    res.status(200);
    res.json(response);
  })
);
