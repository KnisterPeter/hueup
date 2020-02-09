import { produce } from "immer";
import React, {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useReducer
} from "react";

export function createStore<T>(
  initialState: T
): {
  Provider: React.FC<{
    children?: React.ReactNode;
  }>;
  useStore: () => readonly [T, React.Dispatch<(draft: T) => void>];
} {
  const stateContext = createContext(initialState);
  const updateContext = createContext<Dispatch<(draft: T) => void>>(undefined!);

  const StoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [state, updateState] = useReducer(
      produce as (state: T, action: (draft: T) => void) => T,
      initialState
    );
    return (
      <updateContext.Provider value={updateState}>
        <stateContext.Provider value={state}>{children}</stateContext.Provider>
      </updateContext.Provider>
    );
  };

  const useStore = () =>
    [useContext(stateContext), useContext(updateContext)] as const;

  return { Provider: StoreProvider, useStore };
}
