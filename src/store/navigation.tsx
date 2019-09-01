import { computed, observable } from "mobx";
import { FC } from "react";
import { createStore } from "../store-helper";
import { Bridge } from "./bridge";

export class NavigationStore {
  @observable
  public drawerOpen = false;

  @observable
  public view?: FC<{ bridge: Bridge }>;

  @observable
  private _title = "Hue up";

  @computed
  public get title(): string | undefined {
    return this._title;
  }

  public set title(title: string | undefined) {
    this._title = title || "Hue up";
  }
}

const { Provider, use } = createStore(() => new NavigationStore());
export { Provider as NavigationProvider, use as useNavigation };
