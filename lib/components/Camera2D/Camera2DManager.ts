import { none, Option, some } from "@aicacia/core";
import { DefaultManager } from "../../sceneGraph";

export class Camera2DManager extends DefaultManager<Camera2D> {
  private active: Option<Camera2D> = none();

  setActive(camera: Camera2D) {
    if (
      camera
        .getManager()
        .map(manager => manager === this)
        .unwrapOr(false)
    ) {
      this.active = some(camera);
    } else {
      throw new Error(
        "Camera2DManager.setActive(camera: Camera2D): cannot set active if camera is not in manager"
      );
    }
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
