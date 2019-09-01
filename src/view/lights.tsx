import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import { Bridge, Lights } from "../store/bridge";
import { useBridgeFunction, useTitle } from "../_hooks";

export const View: FC<{ bridge: Bridge }> = ({ bridge }) => {
  useTitle("Lights");

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
};

const Light: FC<{
  bridge: Bridge;
  id: string;
  light: Lights[0];
  refresh: () => void;
}> = ({ bridge, id, light, refresh }) => {
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
};
