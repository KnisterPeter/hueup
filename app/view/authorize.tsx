import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography
} from "@material-ui/core";
import { useObserver } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { useTitle } from "../hooks/title";
import { useBridges } from "../store/bridges";
import { Routes, useNavigation } from "../store/navigation";

export default function Authorize() {
  useTitle("Authorize bridge");

  const [busy, setBusy] = useState(false);

  const bridges = useBridges();
  const navigation = useNavigation();

  // if (!bridges.selected) {
  //   navigation.to = Routes["/"];
  //   return null;
  // }
  const bridge = bridges.selected;

  if (bridge && bridge.username) {
    navigation.to = Routes["/overview"];
    return null;
  }

  const onAuthorize = useCallback(() => {
    setBusy(true);
    bridge.startAuth();
  }, [bridge, setBusy]);

  const onCancel = useCallback(() => {
    bridges.select(undefined);
    navigation.to = Routes["/"];
  }, [bridges, navigation]);

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
          disabled={busy}
        >
          Authorize
        </Button>
        {!busy && (
          <Grid item xs={8}>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
        )}
        {busy && <CircularProgress />}
      </Grid>
    </Box>
  ));
}
