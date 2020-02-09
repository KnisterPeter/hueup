import { createStore } from "./_helper";

const { Provider: TitleProvider, useStore: useTitle } = createStore("hueup");

export function setTitle(title: string): void {
  const [, updateTitle] = useTitle();
  updateTitle(() => title);
}

export { TitleProvider, useTitle };
