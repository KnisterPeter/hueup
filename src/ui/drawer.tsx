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
import logo from "../logo.png";
import { useBridges } from "../store/bridges";
import { Routes as R, useNavigation } from "../store/navigation";

export function Drawer() {
  const bridges = useBridges();
  const navigation = useNavigation();

  const onChangeBridge = useCallback(() => {
    bridges.select(undefined);
    navigation.drawerOpen = false;
  }, [bridges, navigation]);

  const onShowGroups = useCallback(() => (navigation.to = R["/groups"]), [
    navigation
  ]);
  const onShowLigths = useCallback(() => (navigation.to = R["/lights"]), [
    navigation
  ]);
  const onShowConfig = useCallback(() => (navigation.to = R["/config"]), [
    navigation
  ]);

  const openDrawer = useCallback(() => (navigation.drawerOpen = true), [
    navigation
  ]);
  const closeDrawer = useCallback(() => (navigation.drawerOpen = false), [
    navigation
  ]);

  return useObserver(() => (
    <SwipeableDrawer
      anchor="left"
      open={navigation.drawerOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
    >
      <div style={{ minWidth: "200px" }}>
        <img src={logo} style={{ margin: 10, width: 180, height: 180 }} />
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
