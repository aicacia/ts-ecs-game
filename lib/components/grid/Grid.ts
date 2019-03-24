import { vec4 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { GridManager } from "./GridManager";

export class Grid extends Component {
  static Manager = GridManager;
  static componentName = "engine.Grid";

  private size: number = 1.0;
  private lineSize: number = 1.0;
  private color: vec4 = vec4.fromValues(0, 0, 0, 0.2);

  getSize() {
    return this.size;
  }
  setSize(size: number) {
    this.size = size;
    return this;
  }

  getLineSize() {
    return this.lineSize;
  }
  setLineSize(lineSize: number) {
    this.lineSize = lineSize;
    return this;
  }

  getColor() {
    return this.color;
  }
  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
}
