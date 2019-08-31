import { useObserver } from "mobx-react-lite";
import React, { FC, useCallback } from "react";
import { Bridge } from "./bridge";
import { Overview } from "./overview";

export const Authorize: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const onAuthorize = useCallback(() => bridge.authorize(), []);

  return useObserver(() => (
    <div>
      <div>id: {bridge.id}</div>
      {bridge.username ? (
        <Overview bridge={bridge} />
      ) : (
        <>
          Press the button on the bridge
          <button onClick={onAuthorize}>Authorize</button>
        </>
      )}
    </div>
  ));
};
