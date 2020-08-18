import { Option } from "@aicacia/core";
import { DefaultManager } from "../../sceneGraph";
export declare class Camera2DManager extends DefaultManager<Camera2D> {
    private active;
    setActive(camera: Camera2D): this;
    getActive(): Option<Camera2D>;
    getRequiredActive(): Camera2D;
    addComponent(camera: Camera2D): this;
    removeComponent(camera: Camera2D): this;
    onInit(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
}
import { Camera2D } from "./Camera2D";