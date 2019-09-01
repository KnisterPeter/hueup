import React from "react";
import * as ReactDOM from "react-dom";
import "typeface-roboto";
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        console.log("SW registered: ", registration);
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
