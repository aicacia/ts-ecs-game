import { DefaultManager } from "@aicacia/ecs";
import type { Camera2DControl } from "./Camera2DControl";
export declare class Camera2DControlManager extends DefaultManager<Camera2DControl> {
    onInit(): this;
    onAfterUpdate(): this;
}
