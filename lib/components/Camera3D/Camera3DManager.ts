import { none, Option, some } from "@aicacia/core";
import { DefaultManager } from "../../sceneGraph";

export class Camera3DManager extends DefaultManager<Camera3D> {
  static managerName = "engine.Camera3DManager";

  private active: Option<Camera3D> = none();

  setActive(camera: Camera3D) {
    if (
      camera
        .getManager()
        .map(manager => manager === this)
        .unwrapOr(false)
    ) {
      this.active = some(camera);
    } else {
      throw new Error(
        "Camera3DManager.setActive(camera: Camera3D): cannot set active if camera is not in manager"
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

  addComponent(camera: Camera3D) {
    super.addComponent(camera);

    if (this.active.isNone()) {
      this.active = some(camera);
    }

    return this;
  }

  removeComponent(camera: Camera3D) {
    super.removeComponent(camera);

    this.active.map(active => {
      if (active === camera) {
        this.active = none();
      }
    });

    return this;
  }
}

import { Camera3D } from "./Camera3D";
