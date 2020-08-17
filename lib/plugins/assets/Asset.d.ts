/// <reference types="node" />
import { EventEmitter } from "events";
export interface Asset {
    on(event: "load" | "unload", listener: () => void): this;
    on(event: "load-error" | "unload-error", listener: (error: Error) => void): this;
}
export declare abstract class Asset extends EventEmitter {
    private name;
    private loaded;
    private loading;
    getName(): string;
    setName(name: string): this;
    isLoaded(): boolean;
    isLoading(): boolean;
    load(): Promise<void>;
    unload(): Promise<void>;
    protected abstract loadAsset(): Promise<void>;
    protected abstract unloadAsset(): Promise<void>;
}
