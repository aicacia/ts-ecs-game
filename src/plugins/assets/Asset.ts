import { EventEmitter } from "events";

// tslint:disable-next-line: interface-name
export interface Asset {
  on(event: "load" | "unload", listener: () => void): this;
  on(
    event: "load-error" | "unload-error",
    listener: (error: Error) => void
  ): this;
}

export abstract class Asset extends EventEmitter {
  private name: string = "";
  private loaded: boolean = false;
  private loading: boolean = false;

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }
  isLoaded() {
    return this.loaded;
  }
  isLoading() {
    return this.loading;
  }

  load(): Promise<void> {
    if (this.loaded) {
      return Promise.resolve();
    } else {
      this.loading = true;
      return this.loadAsset()
        .then(() => {
          this.loading = false;
          this.loaded = true;
          this.emit("load");
        })
        .catch((error) => {
          this.loading = true;
          this.emit("load-error", error);
          throw error;
        });
    }
  }

  unload(): Promise<void> {
    if (!this.loaded) {
      return Promise.resolve();
    } else {
      return this.unloadAsset()
        .then(() => {
          this.loaded = false;
          this.emit("unload");
        })
        .catch((error) => {
          this.emit("unload-error", error);
          throw error;
        });
    }
  }

  abstract loadAsset(): Promise<void>;
  abstract unloadAsset(): Promise<void>;
}
