import { IConstructor } from "@aicacia/core";
export declare type IPoolDeconstructor<T extends Object, A extends any[] = any[]> = (object: T, ...args: A) => void;
export declare function DEFAULT_DECONSTRUCTOR<T extends Object>(object: T): void;
export declare class Pool<T extends Object, CA extends any[] = any[], DA extends any[] = any[]> {
    private pool;
    private Constructor;
    private Deconstructor;
    private limit;
    constructor(Constructor: IConstructor<T, CA>, Deconstructor?: IPoolDeconstructor<T, DA>, limit?: number);
    getLimit(): number;
    setLimit(limit?: number): this;
    create(...args: CA): T;
    release(object: T, ...args: DA): number;
    clear(): this;
    private cleanUpPool;
}
