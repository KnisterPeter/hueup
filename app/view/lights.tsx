import {
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from "@material-ui/core";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import { useObserver } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import {
  fetchLights,
  LightsProvider,
  useBridge,
  useLights
} from "../store/bridge";
import { Light } from "../store/lights";
import { navigateTo, Route } from "../store/navigation";
import { setTitle } from "../store/title";

export default function View() {
  setTitle("Lights");

  const [bridge] = useBridge();
  if (!bridge.username) {
    navigateTo(Route["/"]);
    return null;
  }

  return (
    <LightsProvider>
      <LightsView />
    </LightsProvider>
  );
}

const LightsView = () => {
  const [bridge] = useBridge();
  const [lights, updateLights] = useLights();

  useEffect(() => {
    if (bridge.username) {
      fetchLights(bridge.username).then(lights => {
        updateLights(() => lights);
      });
    }
  }, []);

  return !lights ? (
    <CircularProgress />
  ) : (
    <List>
      {Object.keys(lights).map(id => (
        <LightView key={id} id={id} light={lights[id]} />
      ))}
    </List>
  );
};

function LightView({ id, light }: { id: string; light: Light }) {
  const [bridge] = useBridge();
  const [, updateLights] = useLights();

  const onClick = useCallback(async () => {
    if (bridge.username) {
      const lights = await fetchLights(bridge.username);
      updateLights(() => lights);
    }
  }, [bridge, id, light]);

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
