import { Body } from "./Body";
import { BroadPhase } from "./phases/BroadPhase";
import { IBroadPhase } from "./phases/IBroadPhase";
import { INarrowPhase } from "./phases/INarrowPhase";
import { NarrowPhase } from "./phases/NarrowPhase";

export class World {
  private bodies: Body[] = [];
  private broadPhase: IBroadPhase = new BroadPhase();
  private narrowPhase: INarrowPhase = new NarrowPhase();

  addBodies(bodies: Body[]) {
    bodies.forEach(body => this._addBody(body));
    return this;
  }
  addBody(...bodies: Body[]) {
    return this.addBodies(bodies);
  }

  removeBodies(bodies: Body[]) {
    bodies.forEach(body => this._removeBody(body));
    return this;
  }
  removeBody(...bodies: Body[]) {
    return this.removeBodies(bodies);
  }

  getBodies() {
    return this.bodies;
  }

  run() {
    const pairs = this.broadPhase.run(this.bodies);
    return this.narrowPhase.run(pairs);
  }

  private _addBody<B extends Body>(body: B) {
    if (this.bodies.indexOf(body) === -1) {
      this.bodies.push(body);
    }
    return this;
  }

  private _removeBody<B extends Body>(body: B) {
    const index = this.bodies.indexOf(body);

    if (this.bodies.indexOf(body) !== -1) {
      this.bodies.splice(index, 1);
    }

    return this;
  }
}
