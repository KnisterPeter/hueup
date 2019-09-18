import {
  AppBar,
  Button,
  CssBaseline,
  IconButton,
  Snackbar,
  Toolbar,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import { useObserver } from "mobx-react-lite";
import React, { FC, lazy, Suspense, useCallback } from "react";
import { useServiceWorkerInstallPrompt } from "../pwa";
import { Routes, useNavigation } from "../store/navigation";
import BridgeSelection from "../view/bridge-selection";
import { Drawer } from "./drawer";

const LazyAuthorize = lazy(() => import("../view/authorize"));
const LazyAuthorized = lazy(() => import("../view/authorized"));
const LazyOverview = lazy(() => import("../view/overview"));
const LazyGroups = lazy(() => import("../view/groups"));
const LazyLights = lazy(() => import("../view/lights"));
const LazyConfig = lazy(() => import("../view/config"));

export function App() {
  const navigation = useNavigation();

  const [
    updateAvailable,
    promptForUpdate,
    cancelUpdate
  ] = useServiceWorkerInstallPrompt();

  const toggleDrawer = useCallback(() => {
    navigation.drawerOpen = !navigation.drawerOpen;
  }, [navigation]);

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
      <Route path={Routes["/authorize"]} view={LazyAuthorize} />
      <Route path={Routes["/authorized"]} view={LazyAuthorized} />
      <Route path={Routes["/overview"]} view={LazyOverview} />
      <Route path={Routes["/groups"]} view={LazyGroups} />
      <Route path={Routes["/lights"]} view={LazyLights} />
      <Route path={Routes["/config"]} view={LazyConfig} />
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={updateAvailable}
        onClose={cancelUpdate}
        message="Update availble"
      >
        <Button color="primary" size="small" onClick={promptForUpdate}>
          INSTALL
        </Button>
        <IconButton onClick={cancelUpdate}>
          <CloseIcon />
        </IconButton>
      </Snackbar>
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
