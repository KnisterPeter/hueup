import { useObserver } from "mobx-react-lite";
import React, { FC, useCallback } from "react";
import { Overview } from "./overview";
import { Bridge } from "./store/bridge";

export const Authorize: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const onAuthorize = useCallback(() => bridge.authorize(), []);

  return useObserver(() =>
    bridge.username ? (
      <Overview bridge={bridge} />
    ) : (
      <>
        Press the button on the bridge
        <button onClick={onAuthorize}>Authorize</button>
      </>
    )
  );
};
