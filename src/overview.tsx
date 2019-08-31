import { useLocalStore, useObserver } from "mobx-react";
import React, { FC, useEffect } from "react";
import { Bridge, Lights } from "./bridge";
import { Config } from "./bridge-config";

export const Overview: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const store = useLocalStore<{ view?: FC<{ bridge: Bridge }> }>(() => ({
    view: undefined
  }));

  const setView = (view: FC<{ bridge: Bridge }>) => (store.view = view);

  return useObserver(() => (
    <>
      <button onClick={() => setView(Lights)}>Show Lights</button>
      <button onClick={() => setView(Config)}>Show Config</button>
      {store.view && <store.view bridge={bridge} />}
    </>
  ));
};

const Lights: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const store = useLocalStore<{ lights?: Lights }>(() => ({
    lights: undefined
  }));

  useEffect(() => {
    bridge.loadLights().then(lights => (store.lights = lights));
  }, [bridge]);

  return useObserver(() =>
    store.lights ? (
      <div>
        Lights
        <ul>
          {Object.keys(store.lights).map(id => (
            <li key={id}>{store.lights![id].name}</li>
          ))}
        </ul>
      </div>
    ) : (
      <div>loading...</div>
    )
  );
};
