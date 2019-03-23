import { vec2 } from "gl-matrix";
import { Transform2D } from "../../../components";
import { Component, Entity } from "../../../sceneGraph";
import { angleVec2 } from "../../../utils/math";
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
  getLine(out: vec2) {
    return vec2.sub(out, this.getStartPosition(), this.getEndPosition());
  }
  getLength() {
    return vec2.len(this.getLine(VEC2_0));
  }

  onUpdate() {
    this.start.getComponent(Transform2D).flatMap(start =>
      this.end.getComponent(Transform2D).map(end => {
        const direction = vec2.sub(
            VEC2_0,
            start.getPosition(),
            end.getPosition()
          ),
          posAngle = angleVec2(direction),
          negAngle = angleVec2(vec2.scale(direction, direction, -1));

        start.setLocalRotation(negAngle);
        end.setLocalRotation(posAngle);
      })
    );
    return this;
  }
}
