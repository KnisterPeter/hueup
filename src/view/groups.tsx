import { useObserver } from "mobx-react";
import React, { useCallback } from "react";
import { useBridgeFunction } from "../hooks/bridge-function";
import { useTitle } from "../hooks/title";
import { Bridge, Groups } from "../store/bridge";
import { useSelectedBridge } from "../store/bridges";

export default function View() {
  useTitle("Rooms and Zones");

  const bridge = useSelectedBridge();
  if (!bridge) {
    return null;
  }

  const [store, refresh] = useBridgeFunction(bridge, bridge.loadGroups);

  return useObserver(() =>
    store.loading ? (
      <div>loading...</div>
    ) : (
      <ul>
        {Object.keys(store.value).map(id => (
          <Group
            key={id}
            bridge={bridge}
            id={id}
            group={store.value[id]}
            refresh={refresh}
          />
        ))}
      </ul>
    )
  );
}

function Group({
  bridge,
  id,
  group,
  refresh
}: {
  bridge: Bridge;
  id: string;
  group: Groups[0];
  refresh: () => void;
}) {
  const onClick = useCallback(() => {
    bridge.setGroupState(id, { on: !group.state.all_on }).then(refresh);
  }, []);

  return useObserver(() => (
    <li>
      {group.name}
      <br />
      On={group.state.all_on ? "true" : "false"}
      <br />
      <button onClick={onClick}>On/Off</button>
    </li>
  ));
}
