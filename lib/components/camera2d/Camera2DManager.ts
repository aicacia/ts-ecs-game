import { none, Option, some } from "@aicacia/core";
import { Manager } from "../../sceneGraph";

export class Camera2DManager extends Manager {
  static managerName = "engine.Camera2DManager";

  private active: Option<Camera2D> = none();

  setActive(camera: Camera2D) {
    this.active = some(camera);
    return this;
  }
  getActive() {
    return this.active;
  }

  addComponent(camera: Camera2D) {
    super.addComponent(camera);

    if (this.active.isNone()) {
      this.active = some(camera);
    }

    return this;
  }
}

import { Camera2D } from "./Camera2D";
