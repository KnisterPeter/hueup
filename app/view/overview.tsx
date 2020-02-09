import { useEffect } from "react";
import { useBridge } from "../store/bridge";
import { navigateTo, Route } from "../store/navigation";

export default function Overview() {
  const [bridge] = useBridge();

  useEffect(() => {
    if (bridge.username) {
      navigateTo(Route["/groups"]);
    } else {
      navigateTo(Route["/authorize"]);
    }
  }, [bridge]);

  return null;
}
