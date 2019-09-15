import { fn } from "../_fn";

export default fn(async (_, res, api) => {
  const lights = await api.lights.getAll();

  res.status(200);
  res.json(lights);
});
