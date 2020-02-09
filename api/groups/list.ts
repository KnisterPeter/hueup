import { fn } from "../_fn";

export default fn(async (_, res, api) => {
  const groups = await api.groups.getAll();

  res.status(200);
  res.json(groups.map(group => group.getJsonPayload()));
});
