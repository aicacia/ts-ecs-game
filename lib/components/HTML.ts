import { vec2 } from "gl-matrix";
import { Component } from "../sceneGraph";
import { radToDeg } from "../utils/math";
import { Camera2DManager, Transform2D } from "./2d";
import { HTMLManager } from "./HTMLManager";

const VEC2_0 = vec2.create();

export class HTML extends Component {
  static componentName = "engine.HTML";
  static Manager = HTMLManager;

  private element: HTMLElement;
  private useRotation: boolean = true;

  constructor(element: HTMLElement) {
    super();

    this.element = element;
    this.element.style.position = "absolute";
    this.element.style.transformOrigin = "left";
  }

  getUseRotation() {
    return this.useRotation;
  }
  setUseRotation(useRotation: boolean) {
    this.useRotation = useRotation;
    return this;
  }

  onUpdate() {
    const camera = this.getScene()
        .flatMap(scene => scene.getManager(Camera2DManager))
        .flatMap(cameraManager => cameraManager.getActive())
        .expect("HTML Component must have an active Camera2D"),
      transform2d = this.getComponent(Transform2D).expect(
        "HTML Component - Transform2D Component is required"
      ),
      position = camera.toScreen(VEC2_0, transform2d.getPosition());

    if (this.useRotation) {
      const rotation = radToDeg(-transform2d.getRotation());
      this.element.style.transform = `translate(${position[0]}px, ${
        position[1]
      }px) rotate(${rotation}deg)`;
    } else {
      this.element.style.transform = `translate(${position[0]}px, ${
        position[1]
      }px)`;
    }

    return this;
  }
}
