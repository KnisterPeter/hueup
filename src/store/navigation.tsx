import { observable } from "mobx";
import { FC } from "react";
import { createStore } from "../store-helper";
import { Bridge } from "./bridge";

export class NavigationStore {
  @observable
  public drawerOpen = false;

  @observable
  public view?: FC<{ bridge: Bridge }>;
}

const { Provider, use } = createStore(() => new NavigationStore());
export { Provider as NavigationProvider, use as useNavigation };
