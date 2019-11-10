import { vec4 } from "gl-matrix";
import { Component } from "../../../sceneGraph";
import { PointManager } from "./PointManager";

export enum PointType {
  None = "None",
  Circle = "Circle",
  Square = "Square",
  Triangle = "Triangle"
}

export class Point extends Component {
  static componentName = "engine.Point";
  static Manager = PointManager;

  private size: number = 2;
  private type: PointType = PointType.Circle;
  private fill: boolean = true;
  private color: vec4 = vec4.fromValues(0, 0, 0, 1.0);

  setSize(size: number) {
    this.size = size;
    return this;
  }
  getSize() {
    return this.size;
  }

  setType(type: PointType) {
    this.type = type;
    return this;
  }
  getType() {
    return this.type;
  }

  setFill(fill: boolean) {
    this.fill = fill;
    return this;
  }
  getFill() {
    return this.fill;
  }

  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
  getColor() {
    return this.color;
  }
}
