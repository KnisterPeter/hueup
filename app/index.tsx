import React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
import "./pwa";
import { BridgeProvider } from "./store/bridge";
import { PathProvider } from "./store/navigation";
import { TitleProvider } from "./store/title";
import { App } from "./ui/app";
import { DrawerProvider } from "./ui/drawer";

ReactDOM.render(
  <DrawerProvider>
    <TitleProvider>
      <PathProvider>
        <BridgeProvider>
          <App />
        </BridgeProvider>
      </PathProvider>
    </TitleProvider>
  </DrawerProvider>,
  document.getElementById("app")
);
