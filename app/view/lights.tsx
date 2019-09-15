import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from "@material-ui/core";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import { useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useBridgeFunction } from "../hooks/bridge-function";
import { useTitle } from "../hooks/title";
import { Bridge } from "../store/bridge";
import { useSelectedBridge } from "../store/bridges";
import { Light } from "../store/lights";

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
          <LightView
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

function LightView({
  bridge,
  id,
  light,
  refresh
}: {
  bridge: Bridge;
  id: string;
  light: Light;
  refresh: () => void;
}) {
  const onClick = useCallback(() => {
    bridge.setLightState(id, { on: !light.state.on }).then(refresh);
  }, [bridge, id, light, refresh]);

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
