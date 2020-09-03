import { IConstructor } from "@aicacia/core";

export type IPoolDeconstructor<T extends Object, A extends any[] = any[]> = (
  object: T,
  ...args: A
) => void;

export function DEFAULT_DECONSTRUCTOR<T extends Object>(object: T) {
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      object[key] = null as any;
    }
  }
}

export class Pool<
  T extends Object,
  CA extends any[] = any[],
  DA extends any[] = any[]
> {
  private pool: T[] = [];
  private Constructor: IConstructor<T, CA>;
  private Deconstructor: IPoolDeconstructor<T, DA>;
  private limit: number;

  constructor(
    Constructor: IConstructor<T, CA>,
    Deconstructor: IPoolDeconstructor<T, DA> = DEFAULT_DECONSTRUCTOR as any,
    limit = Infinity
  ) {
    this.Constructor = Constructor;
    this.Deconstructor = Deconstructor;
    this.limit = limit;
  }

  getLimit() {
    return this.limit;
  }
  setLimit(limit = Infinity) {
    this.limit = limit;
    return this.cleanUpPool();
  }

  create(...args: CA) {
    const object = this.pool.pop();

    if (object) {
      this.Constructor.apply(object, args);
      return object;
    } else {
      return new this.Constructor(...args);
    }
  }

  release(object: T, ...args: DA) {
    this.cleanUpPool();
    this.Deconstructor(object, ...args);
    return this.pool.push(object);
  }

  clear() {
    this.pool.length = 0;
    return this;
  }

  private cleanUpPool() {
    if (this.limit < this.pool.length) {
      this.pool.length = this.limit;
    }
    return this;
  }
}
