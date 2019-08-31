import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import { Bridge, Groups } from "../store/bridge";
import { useBridgeFunction } from "./_hooks";

export const GroupsView: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const [store, refresh] = useBridgeFunction(bridge, bridge.loadGroups);

  return useObserver(() =>
    store.loading ? (
      <div>loading...</div>
    ) : (
      <div>
        Rooms and Zones
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
      </div>
    )
  );
};

const Group: FC<{
  bridge: Bridge;
  id: string;
  group: Groups[0];
  refresh: () => void;
}> = ({ bridge, id, group, refresh }) => {
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
};
