/// <reference types="node" />
import { Option, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";
export declare abstract class InputHandler<I extends Input = Input> extends EventEmitter {
    private input;
    private events;
    getConstructor(): IConstructor<this>;
    UNSAFE_setInput(input: I): this;
    UNSAFE_removeInput(): this;
    getInput(): Option<I>;
    getRequiredInput(): I;
    getScene(): Option<import("../..").Scene>;
    getRequiredScene(): import("../..").Scene;
    getElement(): Element;
    getEvents(): Event[];
    queueEvent: (event: Event) => this;
    onAdd(): this;
    onRemove(): this;
    onUpdate(time: Time): this;
    onAfterUpdate(_time: Time): this;
    onEvent(_time: Time, _event: Event): this;
}
import { Time } from "../Time";
import { Input } from "./Input";
