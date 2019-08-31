import { useObserver } from "mobx-react";
import React, { FC, useCallback } from "react";
import { createGlobalStyle } from "styled-components";
import { Authorize } from "./authorize";
import { Bridge, useBridges } from "./bridges";

const GlobalStyle = createGlobalStyle`
* {box-sizing: border-box}

html, body {
    margin: 0;
    padding: 0;
}
`;

export const BridgeSelection = () => {
  const bridges = useBridges();

  return useObserver(() => (
    <>
      <GlobalStyle />
      {bridges.selected ? (
        <Authorize bridge={bridges.selected} />
      ) : (
        bridges.available.map(bridge => (
          <Bridge key={bridge.id} bridge={bridge} />
        ))
      )}
    </>
  ));
};

const Bridge: FC<{ bridge: Bridge }> = ({ bridge }) => {
  const bridges = useBridges();
  const onChange = useCallback(() => bridges.select(bridge), []);

  return useObserver(() => (
    <>
      {bridge.internalipaddress}
      <button onClick={onChange}>Connect</button>
    </>
  ));
};
