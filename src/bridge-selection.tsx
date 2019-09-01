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
import React, { FC, useCallback } from "react";
import { Authorize } from "./authorize";
import { Bridge } from "./store/bridge";
import { useBridges } from "./store/bridges";
import { useTitle } from "./_hooks";

export const BridgeSelection = () => {
  useTitle("Select your bridge");

  const bridges = useBridges();

  return useObserver(() =>
    bridges.selected ? (
      <Authorize bridge={bridges.selected} />
    ) : (
      <Container maxWidth="sm">
        <List>
          {bridges.available.map(bridge => (
            <BridgeItem key={bridge.id} bridge={bridge} />
          ))}
        </List>
      </Container>
    )
  );
};

const BridgeItem: FC<{ bridge: Bridge }> = ({ bridge }) => {
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
};
