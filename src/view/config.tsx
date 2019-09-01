import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import { Bridge, BridgeConfig } from "../store/bridge";
import { useBridgeFunction, useTitle } from "../_hooks";

export const View: FC<{ bridge: Bridge }> = ({ bridge }) => {
  useTitle("Users");

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
