import { Option } from "@aicacia/core";
import { DefaultManager } from "../../sceneGraph";
export declare class Camera3DManager extends DefaultManager<Camera3D> {
    private active;
    setActive(camera: Camera3D): this;
    getActive(): Option<Camera3D>;
    getRequiredActive(): Camera3D;
    addComponent(camera: Camera3D): this;
    removeComponent(camera: Camera3D): this;
    onInit(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
}
import { Camera3D } from "./Camera3D";
