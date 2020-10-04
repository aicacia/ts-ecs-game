import { Plugin } from "../Plugin";
import { RunOnUpdateFn } from "../RunOnUpdateFn";
export declare abstract class RunOnUpdatePlugin extends Plugin {
    private queue;
    private swap;
    runOnUpdate(...fns: RunOnUpdateFn<this>[]): this;
    onUpdate(): this;
}
