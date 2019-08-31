import { useLocalStore } from "mobx-react";
import React, { createContext, FC, PropsWithChildren, useContext } from "react";

export function createStore<T>(
  factory: () => T
): { Provider: FC<PropsWithChildren<unknown>>; use: () => T } {
  const Context = createContext<T>(undefined!);

  const Provider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const store = useLocalStore(factory);
    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const use = () => useContext(Context);

  return {
    Provider,
    use
  };
}
