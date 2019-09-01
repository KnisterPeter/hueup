import { Button, Container, Typography } from "@material-ui/core";
import { useObserver } from "mobx-react-lite";
import React, { FC, useCallback } from "react";
import { Overview } from "./overview";
import { Bridge } from "./store/bridge";
import { useTitle } from "./_hooks";

export const Authorize: FC<{ bridge: Bridge }> = ({ bridge }) => {
  useTitle("Authorize bridge");

  const onAuthorize = useCallback(() => bridge.authorize(), []);

  return useObserver(() =>
    bridge.username ? (
      <Overview bridge={bridge} />
    ) : (
      <Container maxWidth="sm">
        <Typography variant="h6">Press the button on the bridge</Typography>
        <Button variant="contained" color="primary" onClick={onAuthorize}>
          Authorize
        </Button>
      </Container>
    )
  );
};
