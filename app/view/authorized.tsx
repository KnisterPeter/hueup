import { useObserver } from "mobx-react-lite";
import { useEffect } from "react";
import { useTitle } from "../hooks/title";
import { useBridges } from "../store/bridges";
import { Routes, useNavigation } from "../store/navigation";

export default function Authorized() {
  useTitle("Authorized bridge");

  const bridges = useBridges();
  const navigation = useNavigation();

  useEffect(() => {
    if (bridges.selected) {
      const bridge = bridges.selected;

      if (bridge.username) {
        navigation.to = Routes["/overview"];
      } else {
        bridge.continueAuth();
      }
    } else {
      navigation.to = Routes["/"];
    }
  }, [bridges, navigation]);

  return useObserver(() => null);
}
