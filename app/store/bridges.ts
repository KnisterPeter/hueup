import { autorun, computed, observable, reaction } from "mobx";
import * as storage from "../storage";
import { Bridge } from "./bridge";
import { NavigationStore, Routes, useNavigation } from "./navigation";
import { createStore } from "./_helper";

const id = (bridge: Bridge) => {
  return bridge.id;
};

export class BridgesStore {
  @computed
  public get selected(): Bridge {
    const data = this._known.find(bridge => bridge.id === this._selected);
    if (!data) {
      throw new Error("No bridge selected (should not happen)");
    }
    return new Bridge(data, this.navigation);
  }

  @observable
  private _known: Bridge[] = [
    {
      id: "remote",
      internalipaddress: "<remote>"
    } as any
  ];

  @observable
  private _selected = this._known[0].id;

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

  constructor(private navigation: NavigationStore) {
    this.discover();
    this.setupStorage();
  }

  private setupStorage(): void {
    this._known = storage.load("known-bridges", this._known);
    this._selected = storage.load("selected-bridge", this._known[0].id);

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

  private async discover(): Promise<void> {
    this._known = [
      {
        id: "remote",
        internalipaddress: "<remote>"
      } as any
    ];
    this.select(this._known[0]);

    return;

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

  public select(bridge?: Bridge): void {
    this._selected = bridge ? bridge.id : this._known[0].id;
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
