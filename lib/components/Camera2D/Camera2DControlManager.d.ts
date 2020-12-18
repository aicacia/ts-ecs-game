import { DefaultManager } from "@aicacia/ecs/lib/DefaultManager";
import type { Camera2DControl } from "./Camera2DControl";
export declare class Camera2DControlManager extends DefaultManager<Camera2DControl> {
    onInit(): this;
    onAfterUpdate(): this;
}
