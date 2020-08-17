/// <reference types="node" />
import { Option, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";
export declare abstract class Plugin extends EventEmitter {
    static pluginPriority: number;
    static requiredPlugins: IRequirement<Plugin>[];
    static getPluginPriority(): number;
    static getRequiredPlugins(): IRequirement<Plugin>[];
    private scene;
    getConstructor(): IConstructor<this>;
    getPluginPriority(): number;
    getRequiredPlugins(): IConstructor<Plugin>[];
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P>;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M>;
    getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>): M;
    validateRequirements(): void;
    UNSAFE_setScene(scene: Scene): this;
    UNSAFE_removeScene(): this;
    getScene(): Option<Scene>;
    getRequiredScene(): Scene;
    onInit(): this;
    onAdd(): this;
    onRemove(): this;
    onAfterUpdate(): this;
    onUpdate(): this;
}
import { IRequirement } from "../utils";
import { Manager } from "./Manager";
import { Scene } from "./Scene";
