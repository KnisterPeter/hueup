import { v3 } from "node-hue-api";
import { secrets } from "../_api";
import { handleError } from "../_error";
import { asString } from "../_query";

export default handleError((req, res) => {
  const appId = asString(req, "appid");
  const state = asString(req, "state");

  const { clientId, clientSecret } = secrets();

  const bootstrap = v3.api.createRemote(clientId, clientSecret);

  res.status(200);
  res.json({ url: bootstrap.getAuthCodeUrl(clientId, appId, state) });
});
