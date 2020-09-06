import { Option } from "@aicacia/core";
import { DefaultDescriptorManager } from "../../DefaultDescriptorManager";
export declare class Camera2DManager extends DefaultDescriptorManager<Camera2D> {
    private active;
    setActive(camera: Camera2D): this;
    getActive(): Option<Camera2D>;
    getRequiredActive(): Camera2D;
    addComponent(camera: Camera2D): this;
    removeComponent(camera: Camera2D): this;
}
import { Camera2D } from "./Camera2D";
