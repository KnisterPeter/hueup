import { useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useBridgeFunction } from "../hooks/bridge-function";
import { BridgeConfig, useBridge } from "../store/bridge";
import { navigateTo, Route } from "../store/navigation";
import { setTitle } from "../store/title";

export default function View() {
  setTitle("Users");

  const [bridge] = useBridge();
  if (!bridge.username) {
    navigateTo(Route["/"]);
    return null;
  }

  const [store] = useBridgeFunction(bridge, bridge.loadConfig);

  return useObserver(() =>
    store.loading ? (
      <div>loading...</div>
    ) : (
      <>
        <h2>{store.value.name}</h2>
        <ul>
          {Object.keys(store.value.whitelist).map(username => (
            <User
              key={username}
              username={username}
              user={store.value!.whitelist[username]}
            />
          ))}
        </ul>
      </>
    )
  );
}

function User({
  username,
  user
}: {
  username: string;
  user: BridgeConfig["whitelist"][0];
}) {
  const [bridge] = useBridge();

  const onClick = useCallback(() => bridge.deleteUser(), [bridge]);

  return useObserver(() => (
    <li>
      {user.name}
      <br />[{username}]<br />
      <button onClick={onClick}>Delete</button>
    </li>
  ));
}
