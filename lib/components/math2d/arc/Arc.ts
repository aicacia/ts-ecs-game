import { Component } from "../../../sceneGraph";

export class Arc extends Component {
  static componentName = "engine.Arc";

  private radius: number = 1;
  private start: number = 0;
  private end: number = Math.PI * 2;

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  getStart() {
    return this.start;
  }
  setStart(start: number) {
    this.start = start;
    return this;
  }

  getEnd() {
    return this.end;
  }
  setEnd(end: number) {
    this.end = end;
    return this;
  }
}
