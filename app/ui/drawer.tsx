import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import logo from "../logo.png";
import { useBridge } from "../store/bridge";
import { navigateTo, Route } from "../store/navigation";
import { createStore } from "../store/_helper";

export const { Provider: DrawerProvider, useStore: useDrawer } = createStore({
  open: false
});

export function openDrawer(): void {
  const [, updateDrawer] = useDrawer();
  updateDrawer(draft => {
    draft.open = true;
  });
}

export function closeDrawer(): void {
  const [, updateDrawer] = useDrawer();
  updateDrawer(draft => {
    draft.open = false;
  });
}

export function toggleDrawer(): void {
  const [, updateDrawer] = useDrawer();
  updateDrawer(draft => {
    draft.open = !draft.open;
  });
}

export function Drawer() {
  const [drawer] = useDrawer();
  const [bridge] = useBridge();

  const onShowGroups = useCallback(() => navigateTo(Route["/groups"]), []);
  const onShowLigths = useCallback(() => navigateTo(Route["/lights"]), []);
  const onShowConfig = useCallback(() => navigateTo(Route["/config"]), []);

  return useObserver(() => (
    <SwipeableDrawer
      anchor="left"
      open={drawer.open}
      onOpen={openDrawer}
      onClose={closeDrawer}
    >
      <div style={{ minWidth: "200px" }}>
        <img src={logo} style={{ margin: 10, width: 180, height: 180 }} />
        <List>
          {bridge.username && (
            <>
              <ListItem button onClick={onShowGroups}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Show Groups" />
              </ListItem>
              <ListItem button onClick={onShowLigths}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Show Lights" />
              </ListItem>
              <ListItem button onClick={onShowConfig}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Show Config" />
              </ListItem>
            </>
          )}
        </List>
      </div>
    </SwipeableDrawer>
  ));
}
