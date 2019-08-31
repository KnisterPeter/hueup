import React from "react";
import * as ReactDOM from "react-dom";
import { BridgeSelection } from "./bridge-selection";
import { BridgesProvider } from "./bridges";

ReactDOM.render(
  <BridgesProvider>
    <BridgeSelection />
  </BridgesProvider>,
  document.getElementById("app")
);
