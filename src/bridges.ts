import { action, autorun, computed, observable, reaction } from "mobx";
import { Bridge } from "./bridge";
import * as storage from "./storage";
import { createStore } from "./store-helper";

const id = (bridge: Bridge) => {
  return bridge.id;
};

export class BridgesStore {
  @observable
  public _selected?: string;

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

  constructor() {
    this.discover();
    this.setupStorage();
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
  public select(bridge: Bridge): void {
    this._selected = bridge.id;
  }
}

const { Provider, use } = createStore(() => new BridgesStore());
export { Provider as BridgesProvider, use as useBridges };
