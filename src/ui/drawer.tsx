import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useObserver } from "mobx-react";
import React, { useCallback } from "react";
import { useBridges } from "../store/bridges";
import { Routes as R, useNavigation } from "../store/navigation";

export function Drawer() {
  const bridges = useBridges();
  const navigation = useNavigation();

  const onChangeBridge = useCallback(() => {
    bridges.select(undefined);
    navigation.drawerOpen = false;
  }, []);

  const onShowGroups = useCallback(() => (navigation.to = R["/groups"]), []);
  const onShowLigths = useCallback(() => (navigation.to = R["/lights"]), []);
  const onShowConfig = useCallback(() => (navigation.to = R["/config"]), []);

  const openDrawer = useCallback(() => (navigation.drawerOpen = true), []);
  const closeDrawer = useCallback(() => (navigation.drawerOpen = false), []);

  return useObserver(() => (
    <SwipeableDrawer
      anchor="left"
      open={navigation.drawerOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
    >
      <div style={{ minWidth: "200px" }}>
        <List>
          {bridges.authenticated && (
            <>
              <ListItem button onClick={onChangeBridge}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Change Bridge" />
              </ListItem>
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
