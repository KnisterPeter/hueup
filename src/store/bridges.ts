import { action, autorun, computed, observable, reaction } from "mobx";
import * as storage from "../storage";
import { Bridge } from "./bridge";
import { NavigationStore, Routes, useNavigation } from "./navigation";
import { createStore } from "./_helper";

const id = (bridge: Bridge) => {
  return bridge.id;
};

export class BridgesStore {
  @observable
  private _selected?: string;

  @computed
  private get selectedData(): Bridge | undefined {
    return this._known.find(bridge => bridge.id === this._selected);
  }

  @computed
  public get selected(): Bridge | undefined {
    const data = this.selectedData;
    if (!data) {
      return undefined;
    }
    return new Bridge(data);
  }

  @observable
  private _known: Bridge[] = [];

  @observable
  private _bridges: Bridge[] = [];

  @computed
  public get available(): Bridge[] {
    return this._bridges;
  }

  @computed
  public get authenticated(): boolean {
    return this.selected !== undefined && this.selected.username !== undefined;
  }

  constructor(navigation: NavigationStore) {
    this.discover();
    this.setupStorage();

    reaction(
      () => this._selected,
      selected => {
        if (selected) {
          navigation.to = Routes["/authorize"];
        } else {
          navigation.to = Routes["/"];
        }
      },
      { fireImmediately: true }
    );
  }

  @action
  private async setupStorage(): Promise<void> {
    this._known = await storage.load("known-bridges", []);
    this._selected = await storage.load("selected-bridge", undefined);

    autorun(() => {
      storage.save("known-bridges", this._known);
    });

    reaction(
      () => this._selected,
      () => {
        storage.save("selected-bridge", this._selected);
      }
    );
  }

  @action
  private async discover(): Promise<void> {
    // todo: handle error
    const response = await fetch("https://discovery.meethue.com/", {
      credentials: "omit",
      mode: "cors"
    });
    this._bridges = await response.json();

    const newBridges = this._bridges.filter(
      bridge => !this._known.map(id).includes(bridge.id)
    );

    this._known = [...this._known, ...newBridges];
  }

  @action
  public select(bridge?: Bridge): void {
    this._selected = bridge ? bridge.id : undefined;
  }
}

export function useSelectedBridge() {
  const navigation = useNavigation();

  const bridges = use();
  if (!bridges.selected) {
    navigation.to = Routes["/"];
    return null;
  }
  return bridges.selected;
}

const { Provider, use } = createStore(
  (dependencies: [NavigationStore]) => new BridgesStore(...dependencies),
  () => [useNavigation()] as [NavigationStore]
);
export { Provider as BridgesProvider, use as useBridges };
