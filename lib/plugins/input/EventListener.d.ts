/// <reference types="node" />
import { Option, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";
export declare abstract class EventListener<I extends Input = Input> extends EventEmitter {
    private input;
    getConstructor(): IConstructor<this>;
    UNSAFE_setInput(input: I): this;
    UNSAFE_removeInput(): this;
    getInput(): Option<I>;
    getRequiredInput(): I;
    getScene(): Option<import("../..").Scene>;
    getRequiredScene(): import("../..").Scene;
    queueEvent(event: InputEvent): Option<I>;
    abstract dequeueEvent(event: InputEvent): boolean;
    onAdd(): this;
    onRemove(): this;
    onUpdate(_time: Time): this;
}
import { Time } from "../Time";
import { Input } from "./Input";
import { InputEvent } from "./InputEvent";
