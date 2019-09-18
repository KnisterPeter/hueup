import React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import "./pwa";
import { BridgesProvider } from "./store/bridges";
import { NavigationProvider } from "./store/navigation";
import { App } from "./ui/app";

ReactDOM.render(
  <NavigationProvider>
    <BridgesProvider>
      <App />
    </BridgesProvider>
  </NavigationProvider>,
  document.getElementById("app")
);
