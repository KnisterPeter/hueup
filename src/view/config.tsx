import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import { Bridge, BridgeConfig } from "../store/bridge";
import { useBridgeFunction } from "./_hooks";

export const ConfigView: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const [store, refresh] = useBridgeFunction(bridge, bridge.loadConfig);

  return useObserver(() =>
    store.loading ? (
      <div>loading...</div>
    ) : (
      <>
        <h2>{store.value.name}</h2>
        <div>
          Users:
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
        </div>
      </>
    )
  );
};

const User: FC<{
  bridge: Bridge;
  username: string;
  user: BridgeConfig["whitelist"][0];
}> = ({ bridge, username, user }) => {
  const onClick = useCallback(() => bridge.deleteUser(), []);

  return useObserver(() => (
    <li>
      {user.name}
      <br />[{username}]<br />
      <button onClick={onClick}>Delete</button>
    </li>
  ));
};
