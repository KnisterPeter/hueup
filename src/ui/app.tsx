import {
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useObserver } from "mobx-react";
import React, { FC, lazy, Suspense, useCallback } from "react";
import { Authorize } from "../authorize";
import { BridgeSelection } from "../bridge-selection";
import { Overview } from "../overview";
import { Routes, useNavigation } from "../store/navigation";
import { Drawer } from "./drawer";

const LazyGroups = lazy(() => import("../view/groups"));
const LazyLights = lazy(() => import("../view/lights"));
const LazyConfig = lazy(() => import("../view/config"));

export function App() {
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
      <Route path={Routes["/"]} view={BridgeSelection} />
      <Route path={Routes["/authorize"]} view={Authorize} />
      <Route path={Routes["/overview"]} view={Overview} />
      <Route path={Routes["/groups"]} view={LazyGroups} />
      <Route path={Routes["/lights"]} view={LazyLights} />
      <Route path={Routes["/config"]} view={LazyConfig} />
    </>
  ));
}

function Route({ path, view }: { path: string; view: FC }) {
  const navigation = useNavigation();
  const View = view;

  return useObserver(() =>
    path === navigation.path ? (
      <Suspense fallback={<div>loading...</div>}>
        <View />
      </Suspense>
    ) : null
  );
}
