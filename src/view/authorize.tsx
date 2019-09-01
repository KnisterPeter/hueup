import { Button, Container, Typography } from "@material-ui/core";
import { useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useTitle } from "../hooks/title";
import { useBridges } from "../store/bridges";
import { Routes, useNavigation } from "../store/navigation";

export default function Authorize() {
  useTitle("Authorize bridge");

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

  const onAuthorize = useCallback(() => bridge.authorize(), []);

  return useObserver(() => (
    <Container maxWidth="sm">
      <Typography variant="h6">Press the button on the bridge</Typography>
      <Button variant="contained" color="primary" onClick={onAuthorize}>
        Authorize
      </Button>
    </Container>
  ));
}
