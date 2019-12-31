import { none, Option, some } from "@aicacia/core";
import { Manager } from "../../../sceneGraph";

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
  getRequiredActive() {
    return this.getActive().expect(`Expected an Active Camera`);
  }

  addComponent(camera: Camera2D) {
    super.addComponent(camera);

    if (this.active.isNone()) {
      this.active = some(camera);
    }

    return this;
  }

  removeComponent(camera: Camera2D) {
    super.removeComponent(camera);

    this.active.map(active => {
      if (active === camera) {
        this.active = none();
      }
    });

    return this;
  }
}

import { Camera2D } from "./Camera2D";
