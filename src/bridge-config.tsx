import { useLocalStore, useObserver } from "mobx-react";
import React, { FC, useCallback, useEffect } from "react";
import { Bridge, BridgeConfig } from "./bridge";

export const Config: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const store = useLocalStore<{ config?: BridgeConfig }>(() => ({
    config: undefined
  }));

  useEffect(() => {
    bridge.loadConfig().then(config => {
      store.config = config;
    });
  }, [bridge]);

  return useObserver(() =>
    store.config ? (
      <>
        <h2>{store.config.name}</h2>
        <div>
          Users:
          <ul>
            {Object.keys(store.config.whitelist).map(username => (
              <User
                key={username}
                bridge={bridge}
                username={username}
                user={store.config!.whitelist[username]}
              />
            ))}
          </ul>
        </div>
      </>
    ) : (
      <div>loading...</div>
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
