import { closeDrawer } from "../ui/drawer";
import { useTitle } from "./title";
import { createStore } from "./_helper";

export enum Route {
  "/" = "/",
  "/authorize" = "/authorize",
  "/authorized" = "/authorized",
  "/overview" = "/overview",
  "/groups" = "/groups",
  "/lights" = "/lights",
  "/config" = "/config"
}

export const { Provider: PathProvider, useStore: usePath } = createStore(
  window.location.pathname
);

export function navigateTo(route: Route): void {
  const [title] = useTitle();
  const [, updatePath] = usePath();

  window.history.pushState({}, title, Route[route]);
  updatePath(() => Route[route]);
  closeDrawer();
}
