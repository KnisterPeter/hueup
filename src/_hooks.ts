import { useLocalStore } from "mobx-react";
import { FC, useCallback, useEffect, useState } from "react";
import { Bridge } from "./store/bridge";
import { useNavigation } from "./store/navigation";

export type BridgeFunctionStore<T> =
  | BridgeFunctionStoreReady<T>
  | BridgeFunctionStoreLoading;

export type BridgeFunctionStoreReady<T> = {
  loading: false;
  value: T;
};

export type BridgeFunctionStoreLoading = {
  loading: true;
  value: undefined;
};

export const useBridgeFunction = <T>(
  bridge: Bridge,
  fn: () => Promise<T>
): [BridgeFunctionStore<T>, () => void] => {
  const [state, setState] = useState();

  const refresh = () => {
    setState({});
  };

  const store = useLocalStore<BridgeFunctionStore<T>>(() => ({
    value: undefined,
    loading: true
  }));

  useEffect(() => {
    store.loading = true;
    fn.call(bridge).then(value => {
      store.value = value;
      store.loading = false;
    });
  }, [bridge, state]);

  return [store, refresh];
};

export const useTitle = (title: string) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.title = title;
    return () => (navigation.title = undefined);
  }, []);
};

export const useView = (
  view: () => Promise<{ View: FC<{ bridge: Bridge }> }>
) => {
  const navigation = useNavigation();

  return useCallback(() => {
    view().then(({ View }) => {
      navigation.view = View;
      navigation.drawerOpen = false;
    });
  }, []);
};
