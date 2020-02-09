import {
  AppBar,
  CircularProgress,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useObserver } from "mobx-react-lite";
import React, { FC, lazy, Suspense } from "react";
import { Route as R, usePath } from "../store/navigation";
import { useTitle } from "../store/title";
import BridgeSelection from "../view/bridge-selection";
import { Drawer, toggleDrawer } from "./drawer";
import { Update } from "./update";

const LazyAuthorize = lazy(() => import("../view/authorize"));
const LazyAuthorized = lazy(() => import("../view/authorized"));
const LazyOverview = lazy(() => import("../view/overview"));
const LazyGroups = lazy(() => import("../view/groups"));
const LazyLights = lazy(() => import("../view/lights"));
const LazyConfig = lazy(() => import("../view/config"));

export function App() {
  const [title] = useTitle();

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer />
      <Route path={R["/"]} view={BridgeSelection} />
      <Route path={R["/authorize"]} view={LazyAuthorize} />
      <Route path={R["/authorized"]} view={LazyAuthorized} />
      <Route path={R["/overview"]} view={LazyOverview} />
      <Route path={R["/groups"]} view={LazyGroups} />
      <Route path={R["/lights"]} view={LazyLights} />
      <Route path={R["/config"]} view={LazyConfig} />
      <Update />
    </>
  );
}

function Route({ path, view }: { path: string; view: FC }) {
  const [currentPath] = usePath();
  const View = view;

  return useObserver(() =>
    path === currentPath ? (
      <Suspense fallback={<CircularProgress />}>
        <View />
      </Suspense>
    ) : null
  );
}
