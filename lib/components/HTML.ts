import { vec2 } from "gl-matrix";
import { Component } from "../sceneGraph";
import { Camera2DManager, Transform2D } from "./2d";
import { HTMLManager } from "./HTMLManager";

const VEC2_0 = vec2.create();

export class HTML extends Component {
  static componentName = "engine.HTML";
  static Manager = HTMLManager;

  private element: HTMLElement;

  constructor(element: HTMLElement) {
    super();

    this.element = element;
    this.element.style.position = "absolute";
  }

  onUpdate() {
    const camera = this.getScene()
        .flatMap(scene => scene.getManager(Camera2DManager))
        .flatMap(cameraManager => cameraManager.getActive())
        .expect("HTML Component must have an active Camera2D"),
      transform2d = this.getComponent(Transform2D).expect(
        "HTML Component - Transform2D Component is required"
      ),
      position = camera.toScreen(VEC2_0, transform2d.getPosition()),
      rotation = -1 * transform2d.getRotation() * Rad2Deg; // todo: fixme this is really bad!!!!
                                                           // but we need text rotation

    this.element.style.left = `${position[0]}px`;
    this.element.style.top = `${position[1]}px`;
    this.element.style.transform = `rotate(${rotation}deg)`;

    return this;
  }
}
