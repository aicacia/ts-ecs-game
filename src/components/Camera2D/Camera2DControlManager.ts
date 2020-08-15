import { DefaultManager } from "../../sceneGraph";
import { Camera2DControl } from "./Camera2DControl";

export class Camera2DControlManager extends DefaultManager<Camera2DControl> {
  onInit() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
}
