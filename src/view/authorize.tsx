import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography
} from "@material-ui/core";
import { useLocalStore, useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useTitle } from "../hooks/title";
import { AuthorizationStatus } from "../store/bridge";
import { useBridges } from "../store/bridges";
import { Routes, useNavigation } from "../store/navigation";

export default function Authorize() {
  useTitle("Authorize bridge");

  const state = useLocalStore<{ busy: boolean; message?: string }>(() => ({
    busy: false,
    message: undefined
  }));

  const bridges = useBridges();
  const navigation = useNavigation();

  if (!bridges.selected) {
    navigation.to = Routes["/"];
    return null;
  }
  const bridge = bridges.selected;

  if (bridge.username) {
    navigation.to = Routes["/overview"];
    return null;
  }

  const onAuthorize = useCallback(() => {
    state.busy = true;
    bridge.authorize(status => {
      switch (status) {
        case AuthorizationStatus.noResponse:
          state.message = "No response from bridge";
          state.busy = false;
          break;
        case AuthorizationStatus.pressButtonOnBridge:
          state.message = "Press button on the bridge now";
          break;
        case AuthorizationStatus.tryAgain:
          state.message = "Try again authorize app";
          state.busy = false;
          break;
        case AuthorizationStatus.unknownError:
          state.message = "Unknown error from the bridge";
          state.busy = false;
          break;
        case AuthorizationStatus.unknownResponse:
          state.message = "Unknown response from the bridge";
          state.busy = false;
          break;
      }
    });
  }, [bridge, state]);

  const onCancel = useCallback(() => {
    bridges.select(undefined);
  }, [bridges]);

  const spacing = 4;

  return useObserver(() => (
    <Box px={spacing / 2} py={spacing} style={{ overflowX: "hidden" }}>
      <Grid
        container
        spacing={spacing}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={8}>
          <Typography>
            To authorize this app, press the button on the bridge and then in 30
            seconds click the authorize button below.
          </Typography>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={onAuthorize}
          disabled={state.busy}
        >
          Authorize
        </Button>
        {!state.busy && (
          <Grid item xs={8}>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
        )}
        {state.message && (
          <Grid item xs={8}>
            <Typography>{state.message}</Typography>
          </Grid>
        )}
        {state.busy && <CircularProgress />}
      </Grid>
    </Box>
  ));
}
