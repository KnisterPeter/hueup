import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import styled from "styled-components";
import { Bridge } from "../store/bridge";
import { useBridges } from "../store/bridges";
import { useNavigation } from "../store/navigation";
import { ConfigView } from "../view/config";
import { GroupsView } from "../view/groups";
import { LightsView } from "../view/lights";

const DrawerList = styled.div`
  min-width: 200px;
`;

export const Drawer: FC = () => {
  const bridges = useBridges();
  const navigation = useNavigation();

  const createCallback = (view: FC<{ bridge: Bridge }>) => () => {
    navigation.view = view;
    navigation.drawerOpen = false;
  };

  const onChangeBridge = useCallback(() => {
    bridges.select(undefined);
    navigation.drawerOpen = false;
  }, []);
  const onShowGroups = useCallback(createCallback(GroupsView), []);
  const onShowLigths = useCallback(createCallback(LightsView), []);
  const onShowConfig = useCallback(createCallback(ConfigView), []);

  const openDrawer = useCallback(() => (navigation.drawerOpen = true), []);
  const closeDrawer = useCallback(() => (navigation.drawerOpen = false), []);

  return useObserver(() => (
    <SwipeableDrawer
      anchor="left"
      open={navigation.drawerOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
    >
      <DrawerList>
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
      </DrawerList>
    </SwipeableDrawer>
  ));
};
