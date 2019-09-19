import { useCallback, useEffect, useState } from "react";
import { BeforeInstallpromptEvent } from "./window";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

export function useServiceWorkerInstallPrompt(): [
  boolean,
  (() => void),
  (() => void)
] {
  const [installPrompt, setInstallPrompt] = useState<
    BeforeInstallpromptEvent | undefined
  >();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      setInstallPrompt(e);
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      setUpdateAvailable(true);
    });
  }, []);

  const promptForUpdate = useCallback(() => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then(() => {
      setInstallPrompt(undefined);
    });
  }, [installPrompt]);

  const cancelUpdate = useCallback(() => {
    setInstallPrompt(undefined);
    setUpdateAvailable(false);
  }, [setInstallPrompt, setUpdateAvailable]);

  return [updateAvailable, promptForUpdate, cancelUpdate];
}
