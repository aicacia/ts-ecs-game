/// <reference types="node" />
import { IConstructor } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { EventEmitter } from "events";
export declare abstract class ToFromJSONEventEmitter extends EventEmitter {
    static jsonName?: string;
    static getJSONName(): string;
    static newFromJSON<T extends ToFromJSONEventEmitter = ToFromJSONEventEmitter>(json: IJSONObject): T;
    getConstructor(): IConstructor<this>;
    toJSON(): IJSONObject;
    fromJSON(_json: IJSONObject): this;
}
