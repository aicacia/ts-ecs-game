import { Plugin } from "../sceneGraph";
export declare type RunOnUpdateFn = () => void;
export declare abstract class RunOnUpdatePlugin extends Plugin {
    private queue;
    private swap;
    enqueue(...events: RunOnUpdateFn[]): this;
    onUpdate(): this;
}
