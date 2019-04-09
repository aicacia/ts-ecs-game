import { vec2, vec4 } from "gl-matrix";
import { angleVec2 } from "../../external/math";
import { Entity, IBuilder } from "../../sceneGraph";
import { Line } from "./Line";
import { Point, PointType } from "./Point";
import { Transform2D } from "./Transform2D";

const VEC2_0 = vec2.create(),
  BLACK = vec4.fromValues(0, 0, 0, 1.0);

export interface IPlotOptions {
  connected?: boolean;
  color?: vec4;
}

export interface IPlotPointOptions {
  point: vec2;
  color?: vec4;
}

export class PlotBuilder implements IBuilder<Entity> {
  private entity: Entity = new Entity();
  private points: IPlotPointOptions[] = [];

  private color: vec4 = vec4.create();
  private connected: boolean = true;

  constructor(options: IPlotOptions = {}) {
    if (options.color) {
      vec4.copy(this.color, options.color);
    }
    if (options.connected != null) {
      this.connected = !!options.connected;
    }
  }

  addPoints(points: IPlotPointOptions[]) {
    points.forEach(point => this.points.push(point));
    return this;
  }
  addPoint(...points: IPlotPointOptions[]) {
    return this.addPoints(points);
  }

  build() {
    this.points.reduce(
      (entity, options) =>
        entity.addChild(
          new Entity().addComponent(
            new Transform2D().setLocalPosition(options.point),
            new Point()
              .setType(this.connected ? PointType.None : PointType.Circle)
              .setColor(options.color || BLACK)
          )
        ),
      this.entity
    );

    const children = this.entity.getChildren();

    for (let i = 0, il = children.length; i < il; i++) {
      const start = children[i],
        end = children[i + 1],
        startTransform = start.getRequiredComponent(Transform2D);

      let len = 0.0;

      if (end) {
        const endTransform = end.getRequiredComponent(Transform2D),
          dist = vec2.sub(
            VEC2_0,
            endTransform.getPosition(),
            startTransform.getPosition()
          );

        len = vec2.length(dist);
        startTransform.setLocalRotation(angleVec2(dist));

        if (this.connected) {
          start.addComponent(
            new Line()
              .setLineWidth(5)
              .setColor(this.color)
              .setLength(len)
          );
        }
      }
    }

    return this.entity;
  }
}
