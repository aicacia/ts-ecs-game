import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
export declare class KeyboardInputHandler extends InputHandler {
    onAdd(): this;
    onRemove(): this;
    onEvent(time: Time, e: KeyboardEvent): this;
}
