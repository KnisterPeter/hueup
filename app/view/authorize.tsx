import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography
} from "@material-ui/core";
import { useObserver } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { useBridge } from "../store/bridge";
import { navigateTo, Route } from "../store/navigation";
import { setTitle } from "../store/title";

export default function Authorize() {
  setTitle("Authorize bridge");

  const [busy, setBusy] = useState(false);

  const [bridge] = useBridge();

  if (bridge && bridge.username) {
    navigateTo(Route["/overview"]);
    return null;
  }

  const onAuthorize = useCallback(() => {
    setBusy(true);
    bridge.startAuth();
  }, [bridge, setBusy]);

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
        {busy && <CircularProgress />}
      </Grid>
    </Box>
  ));
}
