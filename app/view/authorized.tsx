import { useEffect } from "react";
import { useBridge } from "../store/bridge";
import { navigateTo, Route } from "../store/navigation";
import { setTitle } from "../store/title";

export default function Authorized() {
  setTitle("Authorized bridge");

  const [bridge] = useBridge();

  useEffect(() => {
    if (bridge.username) {
      navigateTo(Route["/overview"]);
    } else {
      bridge.continueAuth();
    }
  }, [bridge]);

  return null;
}
