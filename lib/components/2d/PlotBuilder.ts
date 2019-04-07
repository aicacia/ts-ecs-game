import { vec2 } from "gl-matrix";
import { Entity, IBuilder } from "../../sceneGraph";
import { angleVec2 } from "../../utils";
import { Line } from "./Line";
import { Point } from "./Point";
import { Transform2D } from "./Transform2D";

const VEC2_0 = vec2.create();

export class PlotBuilder implements IBuilder<Entity> {
  private entity: Entity = new Entity();
  private points: vec2[] = [];

  addPoints(points: vec2[]) {
    points.forEach(point => this.points.push(point));
    return this;
  }
  addPoint(...points: vec2[]) {
    return this.addPoints(points);
  }

  build() {
    this.points.reduce(
      (entity, point) =>
        entity.addChild(
          new Entity().addComponent(
            new Transform2D().setLocalPosition(point),
            new Point()
          )
        ),
      this.entity
    );

    const children = this.entity.getChildren();

    for (let i = 0, il = children.length; i < il; i++) {
      const start = children[i],
        end = children[i + 1],
        startTransform = start.getComponent(Transform2D).unwrap();

      let len = 0;

      if (end) {
        const endTransform = end.getComponent(Transform2D).unwrap(),
          dist = vec2.sub(
            VEC2_0,
            endTransform.getPosition(),
            startTransform.getPosition()
          );

        len = vec2.length(dist);
        startTransform.setLocalRotation(angleVec2(dist));

        start.addComponent(new Line().setLength(len));
      }
    }

    return this.entity;
  }
}
