import { Option, IConstructor } from "@aicacia/core";
import { ToFromJSONEventEmitter } from "@aicacia/ecs/lib/ToFromJSONEventEmitter";
import type { Time } from "../Time";
import type { Input } from "./Input";
import type { InputEvent } from "./InputEvent";
export declare abstract class EventListener<I extends Input = Input> extends ToFromJSONEventEmitter {
    private input;
    getConstructor(): IConstructor<this>;
    /**
     * @ignore
     */
    UNSAFE_setInput(input: I): this;
    /**
     * @ignore
     */
    UNSAFE_removeInput(): this;
    getInput(): Option<I>;
    getRequiredInput(): I;
    getScene(): Option<import("@aicacia/ecs/lib/Scene").Scene>;
    getRequiredScene(): import("@aicacia/ecs/lib/Scene").Scene;
    queueEvent(event: InputEvent): Option<I>;
    abstract dequeueEvent(event: InputEvent): boolean;
    onAdd(): this;
    onRemove(): this;
    onUpdate(_time: Time): this;
    onAfterUpdate(_time: Time): this;
}
