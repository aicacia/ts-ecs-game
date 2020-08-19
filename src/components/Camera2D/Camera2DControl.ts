import { vec2 } from "gl-matrix";
import { Input } from "../../plugins";
import { Camera2D } from "./Camera2D";
import { TransformComponent } from "../TransformComponent";
import { Component } from "../../sceneGraph";
import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { Camera2DControlManager } from "./Camera2DControlManager";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create(),
  VEC2_2 = vec2.create(),
  ZERO = vec2.fromValues(0, 0),
  MIN_SCALE = vec2.fromValues(1, 1);

export class Camera2DControl extends Component {
  static Manager = Camera2DControlManager;
  static requiredComponents = [[Transform2D, Transform3D]];
  static requiredPlugins = [Input];

  private enabled = true;

  private panSpeed = 1.0;
  private zoomSpeed = 1.0;

  private dragging = false;
  private lastMouse: vec2 = vec2.create();
  private offset: vec2 = vec2.create();

  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled = true) {
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
        transform = TransformComponent.getRequiredTransform(
          this.getRequiredEntity()
        ),
        scale = transform.getLocalScale2(VEC2_1),
        camera = this.getRequiredComponent(Camera2D),
        worldMouse = camera.toRelative(
          VEC2_0,
          vec2.set(VEC2_0, -input.getValue("mouseX"), -input.getValue("mouseY"))
        );

      if (this.dragging) {
        vec2.sub(this.offset, worldMouse, this.lastMouse);
        vec2.scale(this.offset, this.offset, this.panSpeed);
        vec2.mul(this.offset, this.offset, scale);
        vec2.rotate(this.offset, this.offset, ZERO, transform.getRotationZ());
        transform.translate2(this.offset);
      }

      if (input.isDown("mouse1")) {
        this.dragging = true;
      }
      if (input.isUp("mouse1")) {
        this.dragging = false;
      }

      const mouseWheel = input.getValue("mouseWheel"),
        zoomSpeed = vec2.set(VEC2_2, this.zoomSpeed, this.zoomSpeed);

      if (mouseWheel > 0) {
        vec2.add(scale, scale, zoomSpeed);
      } else if (mouseWheel < 0) {
        vec2.sub(scale, scale, zoomSpeed);
        vec2.max(scale, MIN_SCALE, scale);
      }

      transform.setLocalScale2(scale);
      vec2.copy(this.lastMouse, worldMouse);
    }
    return this;
  }
}
