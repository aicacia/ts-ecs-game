import { hash } from "@aicacia/hash";
import { EventEmitter } from "events";
import { Body } from "./Body";
import { BroadPhase } from "./phases/BroadPhase";
import { Contact } from "./phases/Contact";
import { IBroadPhase } from "./phases/IBroadPhase";
import { INarrowPhase } from "./phases/INarrowPhase";
import { NarrowPhase } from "./phases/NarrowPhase";

export class World extends EventEmitter {
  private bodies: Body[] = [];
  private bodiesToAdd: Body[] = [];
  private bodiesToRemove: Body[] = [];
  private broadPhase: IBroadPhase = new BroadPhase();
  private narrowPhase: INarrowPhase = new NarrowPhase();

  private lastColliding: Map<number, Contact> = new Map();
  private colliding: Map<number, Contact> = new Map();

  addBodies(bodies: Body[]) {
    this.bodiesToAdd.push(...bodies);
    return this;
  }
  addBody(...bodies: Body[]) {
    return this.addBodies(bodies);
  }

  removeBodies(bodies: Body[]) {
    this.bodiesToRemove.push(...bodies);
    return this;
  }
  removeBody(...bodies: Body[]) {
    return this.removeBodies(bodies);
  }

  getBodies() {
    return this.bodies;
  }

  maintain() {
    this.emit("maintain");
    this.bodiesToAdd.forEach(body => this.addBodyNow(body));
    this.bodiesToAdd.length = 0;
    this.bodiesToRemove.forEach(body => this.removeBodyNow(body));
    this.bodiesToRemove.length = 0;
    return this;
  }

  update(delta: number) {
    this.emit("update", delta);

    this.maintain();

    this.bodies.forEach(body => body.update(delta));

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

  addBodyNow<B extends Body>(body: B) {
    if (this.bodies.indexOf(body) === -1) {
      this.bodies.push(body);
    }
    return this;
  }

  removeBodyNow<B extends Body>(body: B) {
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
