import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from "@material-ui/core";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import { useObserver } from "mobx-react";
import React, { useCallback } from "react";
import { useBridgeFunction } from "../hooks/bridge-function";
import { useTitle } from "../hooks/title";
import { Bridge, Lights } from "../store/bridge";
import { useSelectedBridge } from "../store/bridges";

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
      <List>
        {Object.keys(store.value).map(id => (
          <Light
            key={id}
            bridge={bridge}
            id={id}
            light={store.value[id]}
            refresh={refresh}
          />
        ))}
      </List>
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
    <ListItem>
      <ListItemIcon>
        <WbIncandescentRoundedIcon />
      </ListItemIcon>
      <ListItemText primary={light.name} />
      <ListItemSecondaryAction>
        <Switch edge="end" onChange={onClick} checked={light.state.on} />
      </ListItemSecondaryAction>
    </ListItem>
  ));
}
