import {
  Avatar,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/Inbox";
import { useObserver } from "mobx-react-lite";
import React, { useCallback, useEffect } from "react";
import { useTitle } from "../hooks/title";
import { Bridge } from "../store/bridge";
import { useBridges } from "../store/bridges";
import { Routes, useNavigation } from "../store/navigation";

export default function BridgeSelection() {
  useTitle("Select your bridge");

  const navigation = useNavigation();
  const bridges = useBridges();

  useEffect(() => {
    if (bridges.selected) {
      navigation.to = Routes["/authorize"];
    }
  }, [bridges, navigation]);

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
  const navigation = useNavigation();
  const bridges = useBridges();
  const onChange = useCallback(() => {
    bridges.select(bridge);
    navigation.to = Routes["/overview"];
  }, [bridges, bridge, navigation]);

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
