import {
  Avatar,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/Inbox";
import { useObserver } from "mobx-react";
import React, { useCallback } from "react";
import { Bridge } from "./store/bridge";
import { useBridges } from "./store/bridges";
import { useTitle } from "./_hooks";

export function BridgeSelection() {
  useTitle("Select your bridge");

  const bridges = useBridges();

  return useObserver(() => (
    <Container maxWidth="sm">
      <List>
        {bridges.available.map(bridge => (
          <BridgeItem key={bridge.id} bridge={bridge} />
        ))}
      </List>
    </Container>
  ));
}

function BridgeItem({ bridge }: { bridge: Bridge }) {
  const bridges = useBridges();
  const onChange = useCallback(() => bridges.select(bridge), []);

  return useObserver(() => (
    <ListItem onClick={onChange}>
      <ListItemAvatar>
        <Avatar>
          <InboxIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={bridge.internalipaddress} secondary={bridge.id} />
    </ListItem>
  ));
}
