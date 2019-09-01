import {
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useObserver } from "mobx-react";
import React, { FC, PropsWithChildren, useCallback } from "react";
import { useNavigation } from "../store/navigation";
import { Drawer } from "./drawer";

export const App: FC<PropsWithChildren<{}>> = ({ children }) => {
  const navigation = useNavigation();

  const toggleDrawer = useCallback(() => {
    navigation.drawerOpen = !navigation.drawerOpen;
  }, []);

  return useObserver(() => (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{navigation.title}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer />
      {children}
    </>
  ));
};
