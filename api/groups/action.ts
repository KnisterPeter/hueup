import { fn } from "../_fn";
import { asString } from "../_query";

export default fn(async (req, res, api) => {
  const id = asString(req, "id");

  await api.groups.setGroupState(id, JSON.parse(req.body));

  res.status(200);
  res.json({});
});
