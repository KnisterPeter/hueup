import { useObserver } from "mobx-react";
import React, { useCallback } from "react";
import { Bridge, Lights } from "../store/bridge";
import { useSelectedBridge } from "../store/bridges";
import { useBridgeFunction, useTitle } from "../_hooks";

export default function View() {
  useTitle("Lights");

  const bridge = useSelectedBridge();
  if (!bridge) {
    return null;
  }

  const [store, refresh] = useBridgeFunction(bridge, bridge.loadLights);

  return useObserver(() =>
    store.loading ? (
      <div>loading...</div>
    ) : (
      <ul>
        {Object.keys(store.value).map(id => (
          <Light
            key={id}
            bridge={bridge}
            id={id}
            light={store.value[id]}
            refresh={refresh}
          />
        ))}
      </ul>
    )
  );
}

function Light({
  bridge,
  id,
  light,
  refresh
}: {
  bridge: Bridge;
  id: string;
  light: Lights[0];
  refresh: () => void;
}) {
  const onClick = useCallback(() => {
    bridge.setLightState(id, { on: !light.state.on }).then(refresh);
  }, []);

  return useObserver(() => (
    <li>
      {light.name}
      <br />
      On={light.state.on ? "true" : "false"}
      <br />
      <button onClick={onClick}>On/Off</button>
    </li>
  ));
}
