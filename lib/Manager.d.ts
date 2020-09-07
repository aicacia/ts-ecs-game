/// <reference types="node" />
import { Option, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";
export declare abstract class Manager<C extends Component = Component> extends EventEmitter {
    static managerPriority: number;
    static getManagerPriority(): number;
    protected scene: Option<Scene>;
    UNSAFE_setScene(scene: Scene): this;
    UNSAFE_removeScene(): this;
    getScene(): Option<Scene>;
    getConstructor(): IConstructor<this>;
    getManagerPriority(): number;
    getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P>;
    getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): P;
    getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M>;
    getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>): M;
    onAdd(): this;
    onRemove(): this;
    abstract addComponent(component: C): this;
    abstract removeComponent(component: C): this;
    abstract isEmpty(): boolean;
    abstract sort(): this;
    abstract onInit(): this;
    abstract onUpdate(): this;
    abstract onAfterUpdate(): this;
}
import { Component } from "./Component";
import { Plugin } from "./Plugin";
import { Scene } from "./Scene";