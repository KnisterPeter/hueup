import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from "@material-ui/core";
import FilterNoneRoundedIcon from "@material-ui/icons/FilterNoneRounded";
import { useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useBridgeFunction } from "../hooks/bridge-function";
import { useTitle } from "../hooks/title";
import { Bridge } from "../store/bridge";
import { useSelectedBridge } from "../store/bridges";
import { Group } from "../store/groups";

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
      <List>
        {Object.keys(store.value).map(id => (
          <GroupView
            key={id}
            bridge={bridge}
            id={id}
            group={store.value[id]}
            refresh={refresh}
          />
        ))}
      </List>
    )
  );
}

function GroupView({
  bridge,
  id,
  group,
  refresh
}: {
  bridge: Bridge;
  id: string;
  group: Group;
  refresh: () => void;
}) {
  const onClick = useCallback(() => {
    bridge.setGroupState(id, { on: !group.state.all_on }).then(refresh);
  }, [bridge, id, group, refresh]);

  return useObserver(() => (
    <ListItem>
      <ListItemIcon>
        <FilterNoneRoundedIcon />
      </ListItemIcon>
      <ListItemText primary={group.name} />
      <ListItemSecondaryAction>
        <Switch edge="end" onChange={onClick} checked={group.state.all_on} />
      </ListItemSecondaryAction>
    </ListItem>
  ));
}
