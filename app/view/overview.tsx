import { useObserver } from "mobx-react-lite";
import { useEffect } from "react";
import { useBridges } from "../store/bridges";
import { Routes, useNavigation } from "../store/navigation";

export default function Overview() {
  const navigation = useNavigation();
  const bridges = useBridges();

  useEffect(() => {
    if (bridges.selected) {
      const bridge = bridges.selected;

      if (bridge.username) {
        navigation.to = Routes["/groups"];
      } else {
        navigation.to = Routes["/authorize"];
      }
    } else {
      navigation.to = Routes["/"];
    }
  }, [bridges, navigation]);

  return useObserver(() => null);
}
