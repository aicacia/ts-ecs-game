import { Time } from "../Time";
import { InputHandler } from "./InputHandler";
export declare class MouseInputHandler extends InputHandler {
    onAdd(): this;
    onRemove(): this;
    onEvent(time: Time, e: MouseEvent): this;
    onAfterUpdate(): this;
}
