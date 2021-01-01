import { DefaultManager } from "@aicacia/ecs";
import type { Camera2DControl } from "./Camera2DControl";

export class Camera2DControlManager extends DefaultManager<Camera2DControl> {
  onInit() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
}
