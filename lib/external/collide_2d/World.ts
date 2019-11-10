import { hash } from "@stembord/hash";
import { EventEmitter } from "events";
import { Body } from "./Body";
import { BroadPhase } from "./phases/BroadPhase";
import { Contact } from "./phases/Contact";
import { IBroadPhase } from "./phases/IBroadPhase";
import { INarrowPhase } from "./phases/INarrowPhase";
import { NarrowPhase } from "./phases/NarrowPhase";

export class World extends EventEmitter {
  private bodies: Body[] = [];
  private broadPhase: IBroadPhase = new BroadPhase();
  private narrowPhase: INarrowPhase = new NarrowPhase();

  private lastColliding: Map<number, Contact> = new Map();
  private colliding: Map<number, Contact> = new Map();

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
    this.bodies.forEach(body => body.update());

    const pairs = this.broadPhase.run(this.bodies),
      contacts = this.narrowPhase.run(pairs);

    this.lastColliding = this.colliding;
    this.colliding = new Map();

    contacts.forEach(contact => {
      const bi = contact.si.getBody().unwrap(),
        bj = contact.sj.getBody().unwrap(),
        hash = this.getHash(bi, bj),
        lastCollide = this.lastColliding.has(hash),
        newCollide = this.colliding.has(hash);

      if (lastCollide && !newCollide) {
        bi.emit("colliding", bj, contact);
        bj.emit("colliding", bi, contact);
      }
      if (!lastCollide && !newCollide) {
        bi.emit("collide-start", bj, contact);
        bj.emit("collide-start", bi, contact);
      }

      this.colliding.set(hash, contact);
    });

    for (const [hash, contact] of this.lastColliding.entries()) {
      if (!this.colliding.has(hash)) {
        const bi = contact.si.getBody().unwrap(),
          bj = contact.sj.getBody().unwrap();

        bi.emit("collide-end", bj, contact);
        bj.emit("collide-end", bi, contact);
      }
    }

    return this;
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

  private getHash(a: Body, b: Body) {
    return hash(a) + hash(b);
  }
}
