import { Plugin } from "@aicacia/ecs/lib/Plugin";
import { IRunOnUpdateFn } from "../IRunOnUpdateFn";
export declare abstract class RunOnUpdatePlugin extends Plugin {
    private queue;
    private swap;
    runOnUpdate(...fns: IRunOnUpdateFn<this>[]): this;
    onUpdate(): this;
}
