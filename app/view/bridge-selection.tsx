import { navigateTo, Route } from "../store/navigation";
import { setTitle } from "../store/title";

export default function BridgeSelection() {
  setTitle("Select your bridge");
  navigateTo(Route["/authorize"]);
  return null;
}
