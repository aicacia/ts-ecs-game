import { vec2 } from "gl-matrix";
import { Input } from "../../plugins";
import { Camera2D } from "./Camera2D";
import { TransformComponent } from "../TransformComponent";
import { Component } from "../../sceneGraph";
import { Transform2D } from "../Transform2D";
import { Transform3D } from "../Transform3D";
import { Camera2DControlManager } from "./Camera2DControlManager";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create();

export class Camera2DControl extends Component {
  static Manager = Camera2DControlManager;
  static requiredComponents = [[Transform2D, Transform3D]];
  static requiredPlugins = [Input];

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
        transform = TransformComponent.getRequiredTransform(
          this.getRequiredEntity()
        ),
        camera = this.getRequiredComponent(Camera2D),
        worldMouse = camera.toRelative(
          VEC2_0,
          vec2.set(VEC2_0, -input.getValue("mouseX"), -input.getValue("mouseY"))
        );

      if (this.dragging) {
        vec2.sub(this.offset, worldMouse, this.lastMouse);
        vec2.scale(this.offset, this.offset, this.panSpeed);
        vec2.mul(this.offset, this.offset, transform.getLocalScale2(VEC2_1));
        transform.translate2(this.offset);
      }

      if (input.isDown("mouse1")) {
        this.dragging = true;
      }
      if (input.isUp("mouse1")) {
        this.dragging = false;
      }

      const mouseWheel = input.getValue("mouseWheel");

      if (mouseWheel > 0) {
        camera.setSize(camera.getSize() + this.zoomSpeed);
      } else if (mouseWheel < 0) {
        camera.setSize(camera.getSize() - this.zoomSpeed);
      }

      vec2.copy(this.lastMouse, worldMouse);
    }
    return this;
  }
}
