import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import { Authorize } from "./authorize";
import { Bridge } from "./store/bridge";
import { useBridges } from "./store/bridges";

export const BridgeSelection = () => {
  const bridges = useBridges();

  return useObserver(() => (
    <>
      {bridges.selected ? (
        <Authorize bridge={bridges.selected} />
      ) : (
        bridges.available.map(bridge => (
          <BridgeItem key={bridge.id} bridge={bridge} />
        ))
      )}
    </>
  ));
};

const BridgeItem: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const bridges = useBridges();
  const onChange = useCallback(() => bridges.select(bridge), []);

  return useObserver(() => (
    <>
      {bridge.internalipaddress}
      <button onClick={onChange}>Connect</button>
    </>
  ));
};
