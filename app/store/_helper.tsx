import { useLocalStore } from "mobx-react-lite";
import React, { createContext, FC, PropsWithChildren, useContext } from "react";

export function createStore<T, D extends object>(
  factory: (dependencies: D) => T,
  dependenciesFactory?: () => D
): { Provider: FC<PropsWithChildren<unknown>>; use: () => T } {
  const Context = createContext<T>(undefined!);

  const Provider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const dependencies = dependenciesFactory
      ? dependenciesFactory()
      : undefined;
    const store = useLocalStore(factory, dependencies);
    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const use = () => useContext(Context);

  return {
    Provider,
    use
  };
}
