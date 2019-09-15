declare module "node-hue-api" {
  class RemoteBoostrap {
    getAuthCodeUrl(deviceId: string, appId: string, state: string): string;

    connectWithCode(
      authorizationCode: string,
      username?: string,
      timeout?: number,
      deviceType?: string
    ): Promise<Api>;

    connectWithTokens(
      accessToken: string,
      refreshToken: string,
      username?: string,
      timeout?: number,
      deviceType?: string
    ): Promise<Api>;
  }

  class Api {
    remote: Remote;
    lights: Lights;
    groups: Groups;
  }

  class Remote {
    getRemoteAccessCredentials(): {
      clientId: string;
      clientSecret: string;
      username: string;
      tokens: {
        access: {
          value: string;
          expiresAt: string;
        };
        refresh: {
          value: string;
          expiresAt: string;
        };
      };
    };
  }

  class Groups {
    getAll(): Promise<unknown>;
    get(id: string): Promise<void>;
    getByName(name: string): Promise<void>;
    createGroup(name: string, lights: string[]): Promise<void>;
    createRoom(
      name: string,
      lights: string[],
      roomClass: string
    ): Promise<void>;
    createZone(
      name: string,
      lights: string[],
      roomClass: string
    ): Promise<void>;
    // TODO
    updateAttributes(id: string, data: any): Promise<void>;
    deleteGroup(id: string): Promise<void>;
    getGroupState(id: string): Promise<void>;
    setGroupState(id: string, state: { on: boolean }): Promise<void>;
    getLightGroups(): Promise<void>;
    getLuminaires(): Promise<void>;
    getLightSources(): Promise<void>;
    getRooms(): Promise<void>;
    getZones(): Promise<void>;
    getEntertainment(): Promise<void>;
    enableStreaming(id: string): Promise<void>;
    disableStreaming(id: string): Promise<void>;
  }

  class Lights {
    getAll(): Promise<unknown>;
    getLightById(id: string): Promise<void>;
    getLightByName(name: string): Promise<void>;
    getNew(): Promise<void>;
    searchForNew(): Promise<void>;
    getLightAttributesAndState(id: string): Promise<void>;
    getLightState(id: string): Promise<void>;
    setLightState(id: string, state: { on: boolean }): Promise<void>;
    rename(id: string, name: string): Promise<void>;
    deleteLight(id: string): Promise<void>;
  }

  export namespace v3 {
    namespace api {
      function createRemote(
        clientId: string,
        clientSecret: string
      ): RemoteBoostrap;
    }
  }
}
