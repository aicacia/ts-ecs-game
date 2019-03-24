import { vec2 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { Camera2DControlManager } from "./Camera2DControlManager";
import { Transform2D } from "./Transform2D";

const VEC2_0 = vec2.create();

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
      const input = this.getPlugin(Input).expect(
          "Camera2DControl - Input Plugin is required"
        ),
        time = this.getPlugin(Time).expect(
          "Camera2DControl - Time Plugin is required"
        ),
        transform = this.getComponent(Transform2D).expect(
          "Camera2DControl - Transform2D Component is required"
        ),
        camera = this.getComponent(Camera2D).expect(
          "Camera2DControl - Camera2D Component is required"
        ),
        orthographicSize = camera.getOrthographicSize();

      if (this.dragging) {
        vec2.sub(
          this.offset,
          vec2.set(VEC2_0, input.getValue("mouseX"), input.getValue("mouseY")),
          this.lastMouse
        );
        this.offset[0] = -this.offset[0];
        vec2.scale(
          this.offset,
          this.offset,
          time.getDelta() * this.panSpeed * orthographicSize * 0.5
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
        camera.setOrthographicSize(
          orthographicSize + 60 * this.zoomSpeed * time.getDelta()
        );
      } else if (input.getValue("mouseWheel") < 0) {
        camera.setOrthographicSize(
          orthographicSize - 60 * this.zoomSpeed * time.getDelta()
        );
      }

      vec2.set(
        this.lastMouse,
        input.getValue("mouseX"),
        input.getValue("mouseY")
      );
    }
    return this;
  }
}

import { Input, Time } from "../../plugins";
import { Camera2D } from "./Camera2D";
