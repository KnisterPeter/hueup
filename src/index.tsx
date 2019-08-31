import React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import { BridgeSelection } from "./bridge-selection";
import { BridgesProvider } from "./store/bridges";
import { NavigationProvider } from "./store/navigation";
import { App } from "./ui/app";

ReactDOM.render(
  <BridgesProvider>
    <NavigationProvider>
      <App>
        <BridgeSelection />
      </App>
    </NavigationProvider>
  </BridgesProvider>,
  document.getElementById("app")
);
