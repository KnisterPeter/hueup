import { useObserver } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useBridgeFunction } from "../hooks/bridge-function";
import { useTitle } from "../hooks/title";
import { Bridge, BridgeConfig } from "../store/bridge";
import { useSelectedBridge } from "../store/bridges";

export default function View() {
  useTitle("Users");

  const bridge = useSelectedBridge();
  if (!bridge) {
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
              bridge={bridge}
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
  bridge,
  username,
  user
}: {
  bridge: Bridge;
  username: string;
  user: BridgeConfig["whitelist"][0];
}) {
  const onClick = useCallback(() => bridge.deleteUser(), [bridge]);

  return useObserver(() => (
    <li>
      {user.name}
      <br />[{username}]<br />
      <button onClick={onClick}>Delete</button>
    </li>
  ));
}
