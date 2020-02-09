import {
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from "@material-ui/core";
import FilterNoneRoundedIcon from "@material-ui/icons/FilterNoneRounded";
import React, { useCallback, useEffect } from "react";
import {
  fetchGroups,
  GroupsProvider,
  updateGroupState,
  useBridge,
  useGroups
} from "../store/bridge";
import { GroupType } from "../store/groups";
import { navigateTo, Route } from "../store/navigation";
import { setTitle } from "../store/title";

export default function View() {
  setTitle("Rooms and Zones");

  const [bridge] = useBridge();
  if (!bridge.username) {
    navigateTo(Route["/"]);
    return null;
  }

  return (
    <GroupsProvider>
      <GroupsView />
    </GroupsProvider>
  );
}

const GroupsView = () => {
  const [bridge] = useBridge();
  const [groups, updateGroups] = useGroups();

  useEffect(() => {
    if (bridge.username) {
      fetchGroups(bridge.username).then(groups => {
        updateGroups(() => groups);
      });
    }
  }, []);

  return !groups ? (
    <CircularProgress />
  ) : (
    <List>
      {Object.keys(groups)
        .filter(id => groups[id].type !== "LightGroup")
        .map(id => (
          <GroupView key={id} id={id} group={groups[id]} />
        ))}
    </List>
  );
};

const GroupView = ({ id, group }: { id: string; group: GroupType }) => {
  const [bridge] = useBridge();
  const [, updateGroups] = useGroups();

  const onClick = useCallback(async () => {
    if (bridge.username) {
      await updateGroupState(bridge.username, id, {
        on: !group.state.all_on
      });
      const groups = await fetchGroups(bridge.username);
      updateGroups(() => groups);
    }
  }, [bridge, id, group]);

  return (
    <ListItem>
      <ListItemIcon>
        <FilterNoneRoundedIcon />
      </ListItemIcon>
      <ListItemText primary={group.name} />
      <ListItemSecondaryAction>
        <Switch edge="end" onChange={onClick} checked={group.state.all_on} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
