import { Option } from "@aicacia/core";
import { hash } from "@aicacia/hash";
import { vec2 } from "gl-matrix";
import { IConstructor } from "../../../utils";
import { Box, Capsule, Circle, Convex, Shape } from "../shapes";
import { Contact } from "./Contact";
import { INarrowPhase } from "./INarrowPhase";

type IHandler = (si: Shape, sj: Shape, contacts: Contact[]) => void;

export class NarrowPhase implements INarrowPhase {
  private contacts: Contact[] = [];
  private handlers: Map<number, IHandler> = new Map();

  constructor() {
    this.setHandler(Circle, Circle, circleToCircleHandler)
      .setHandler(Circle, Convex, circleToConvexHandler)
      .setHandler(Circle, Box, circleToConvexHandler)
      .setHandler(Circle, Capsule, circleToCapsuleHandler)
      .setHandler(Capsule, Capsule, capsuleToCapsuleHandler)
      .setHandler(Capsule, Convex, capsuleToConvexHandler)
      .setHandler(Capsule, Box, capsuleToConvexHandler);
  }

  run(pairs: Array<[Shape, Shape]>): Contact[] {
    this.contacts.length = 0;

    for (let i = 0, il = pairs.length; i < il; i++) {
      const [si, sj] = pairs[i];

      this.getHandler(si, sj)
        .map(handler => handler(si, sj, this.contacts))
        .orElse(() =>
          this.getHandler(sj, si).map(handler => handler(sj, si, this.contacts))
        )
        .expect(`no handler for ${si} ${sj}`);
    }

    return this.contacts;
  }

  setHandler(a: IConstructor<Shape>, b: IConstructor<Shape>, handler: any) {
    this.handlers.set(this.getHash(a, b), handler);
    return this;
  }
  getHandler(si: Shape, sj: Shape) {
    return Option.from(
      this.handlers.get(
        this.getHash(
          Object.getPrototypeOf(si).constructor,
          Object.getPrototypeOf(sj).constructor
        )
      )
    );
  }

  private getHash(a: IConstructor<Shape>, b: IConstructor<Shape>) {
    return hash(a) + hash(b);
  }
}

const CIRCLE_TO_CIRCLE_VEC2_0 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_1 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_2 = vec2.create(),
  CIRCLE_TO_CIRCLE_VEC2_3 = vec2.create();

export const circleToCircleHandler = (
  si: Circle,
  sj: Circle,
  contacts: Contact[]
) => {
  const xi = si.getPosition(),
    xj = sj.getPosition(),
    d = vec2.sub(CIRCLE_TO_CIRCLE_VEC2_0, xi, xj),
    r = si.getRadius() + sj.getRadius(),
    rsq = r * r,
    dsq = vec2.squaredLength(d);

  if (dsq < rsq) {
    const depth = Math.sqrt(rsq) - Math.sqrt(dsq),
      normal = vec2.normalize(CIRCLE_TO_CIRCLE_VEC2_1, d),
      position = vec2.add(
        CIRCLE_TO_CIRCLE_VEC2_2,
        xi,
        vec2.scale(CIRCLE_TO_CIRCLE_VEC2_3, normal, si.getRadius())
      );

    contacts.push(new Contact(si, sj, position, normal, depth));
  }
};

export const circleToConvexHandler = (
  si: Circle,
  sj: Convex,
  contacts: Contact[]
) => {};

export const circleToCapsuleHandler = (
  si: Circle,
  sj: Convex,
  contacts: Contact[]
) => {};

export const capsuleToCapsuleHandler = (
  si: Circle,
  sj: Convex,
  contacts: Contact[]
) => {};

export const capsuleToConvexHandler = (
  si: Circle,
  sj: Convex,
  contacts: Contact[]
) => {};
