import { vec2 } from "gl-matrix";
import { Transform2D } from "../../../components";
import { Component, Entity } from "../../../sceneGraph";
import { LineManager } from "./LineManager";

const VEC2_0 = vec2.create();

export class Line extends Component {
  static componentName = "engine.Line";
  static Manager = LineManager;

  private start: Entity;
  private end: Entity;

  constructor(start: Entity, end: Entity) {
    super();

    this.start = start;
    this.end = end;
  }

  getStart() {
    return this.start;
  }
  getEnd() {
    return this.end;
  }
  getStartPosition() {
    return this.start
      .getComponent(Transform2D)
      .expect("start entity must have a transform component")
      .getPosition();
  }
  getEndPosition() {
    return this.end
      .getComponent(Transform2D)
      .expect("end entity must have a transform component")
      .getPosition();
  }
  getLength() {
    return vec2.len(
      vec2.sub(VEC2_0, this.getStartPosition(), this.getEndPosition())
    );
  }
}
