import { fromAuthorizationCode } from "../_api";
import { setCookies } from "../_cookie";
import { handleError } from "../_error";
import { asString } from "../_query";

export default handleError(async (req, res) => {
  const appId = asString(req, "appid");
  const code = asString(req, "code");

  const api = await fromAuthorizationCode(appId, code);

  const credentials = api.remote.getRemoteAccessCredentials();

  res.status(200);
  setCookies(
    res,
    {
      name: "at",
      value: credentials.tokens.access.value,
      secure: true,
      maxAge: credentials.tokens.access.expiresAt
    },
    {
      name: "rt",
      value: credentials.tokens.refresh.value,
      secure: true,
      maxAge: credentials.tokens.refresh.expiresAt
    }
  );
  res.json({ username: credentials.username });
});
