import { vec2 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { LineManager } from "./LineManager";
import { Transform2D } from "./Transform2D";

const VEC2_0 = vec2.create();

export class Line extends Component {
  static componentName = "engine.Line";
  static Manager = LineManager;

  private length: number = 1.0;

  setLength(length: number) {
    this.length = length;
    return this;
  }
  getLength() {
    return this.length;
  }

  getStart(out: vec2) {
    this.getComponent(Transform2D).map(transform2d => {
      vec2.copy(out, transform2d.getPosition());
    });
    return out;
  }
  getEnd(out: vec2) {
    this.getComponent(Transform2D).map(transform2d => {
      const angle = transform2d.getRotation() + Math.PI * 0.5;

      vec2.copy(out, transform2d.getPosition());
      vec2.set(VEC2_0, Math.cos(angle), Math.sin(angle));
      vec2.scale(VEC2_0, VEC2_0, this.length);
      vec2.add(out, out, VEC2_0);
    });
    return out;
  }
}
