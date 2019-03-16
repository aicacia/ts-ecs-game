import { Component } from "../../../sceneGraph";
import { PointManager } from "./PointManager";

export class Point extends Component {
  static componentName = "engine.Point";
  static Manager = PointManager;

  private size: number = 2;

  setSize(size: number) {
    this.size = size;
    return this;
  }
  getSize() {
    return this.size;
  }
}
