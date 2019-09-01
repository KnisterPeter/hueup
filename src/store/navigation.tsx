import { computed, observable, runInAction } from "mobx";
import { FC } from "react";
import { createStore } from "../store-helper";
import { Bridge } from "./bridge";

export const enum Routes {
  "/" = "/",
  "/authorize" = "/authorize",
  "/overview" = "/overview",
  "/groups" = "/groups",
  "/lights" = "/lights",
  "/config" = "/config"
}

export class NavigationStore {
  @observable
  private _path = window.location.pathname;

  @computed
  public get path(): string {
    return this._path;
  }

  public set to(url: string) {
    runInAction(() => {
      window.history.pushState({}, this.title || "Hue up", url);
      this._path = url;
      this.drawerOpen = false;
    });
  }

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
