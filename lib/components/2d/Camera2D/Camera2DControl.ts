import { vec2 } from "gl-matrix";
import { Component } from "../../../sceneGraph";
import { Transform2D } from "../Transform2D";
import { Camera2DControlManager } from "./Camera2DControlManager";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create();

export class Camera2DControl extends Component {
  static Manager = Camera2DControlManager;
  static componentName = "engine.Camera2DControl";

  private enabled: boolean = true;

  private panSpeed: number = 1.0;
  private zoomSpeed: number = 1.0;

  private dragging: boolean = false;
  private lastMouse: vec2 = vec2.create();
  private offset: vec2 = vec2.create();

  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled: boolean = true) {
    this.enabled = enabled;
    return this;
  }

  getPanSpeed() {
    return this.panSpeed;
  }
  setPanSpeed(panSpeed: number) {
    this.panSpeed = panSpeed;
    return this;
  }

  getZoomSpeed() {
    return this.zoomSpeed;
  }
  setZoomSpeed(zoomSpeed: number) {
    this.zoomSpeed = zoomSpeed;
    return this;
  }

  onUpdate() {
    if (this.enabled) {
      const input = this.getRequiredPlugin(Input),
        time = this.getRequiredPlugin(Time),
        transform = this.getRequiredComponent(Transform2D),
        camera = this.getRequiredComponent(Camera2D),
        size = camera.getSize(),
        worldMouse = camera.toWorld(
          VEC2_0,
          vec2.set(VEC2_0, -input.getValue("mouseX"), -input.getValue("mouseY"))
        );

      if (this.dragging) {
        vec2.sub(this.offset, worldMouse, this.lastMouse);
        vec2.scale(
          this.offset,
          this.offset,
          time.getDelta() * this.panSpeed * 30
        );
        transform.translate(this.offset);
      }

      if (input.isDown("mouse1")) {
        this.dragging = true;
      }
      if (input.isUp("mouse1")) {
        this.dragging = false;
      }

      if (input.getValue("mouseWheel") > 0) {
        camera.setSize(size + 60 * this.zoomSpeed * time.getDelta());
      } else if (input.getValue("mouseWheel") < 0) {
        camera.setSize(size - 60 * this.zoomSpeed * time.getDelta());
      }

      vec2.copy(this.lastMouse, worldMouse);
    }
    return this;
  }
}

import { Input, Time } from "../../../plugins";
import { Camera2D } from "./Camera2D";
