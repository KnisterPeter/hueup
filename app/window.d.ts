export interface BeforeInstallpromptEvent extends Event {
  userChoice: Promise<void>;

  prompt(): void;
}

declare global {
  var BeforeInstallpromptEvent: {
    prototype: BeforeInstallpromptEvent;
    new (): BeforeInstallpromptEvent;
  };
  interface WindowEventMap extends GlobalEventHandlersEventMap {
    beforeinstallprompt: BeforeInstallpromptEvent;
  }
}
