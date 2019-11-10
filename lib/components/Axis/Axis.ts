import { vec4 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { AxisManager } from "./AxisManager";

export class Axis extends Component {
  static Manager = AxisManager;
  static componentName = "engine.Axis";

  private xColor: vec4 = vec4.fromValues(0.9, 0, 0, 0.5);
  private yColor: vec4 = vec4.fromValues(0, 0.9, 0, 0.5);

  getXColor() {
    return this.xColor;
  }
  setXColor(xColor: vec4) {
    vec4.copy(this.xColor, xColor);
    return this;
  }

  getYColor() {
    return this.yColor;
  }
  setYColor(yColor: vec4) {
    vec4.copy(this.yColor, yColor);
    return this;
  }
}
