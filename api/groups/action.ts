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

    const id = req.query.id;
    if (!id) {
      return serverError(res, "id missing");
    }

    const response = await hueApi(
      `/${username}/groups/${id}/action`,
      "PUT",
      req.body
    );

    res.status(200);
    res.json(response);
  })
);
