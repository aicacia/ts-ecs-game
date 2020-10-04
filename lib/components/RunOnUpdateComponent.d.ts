import { RenderableComponent } from "./RenderableComponent";
import { RunOnUpdateFn } from "../RunOnUpdateFn";
export declare abstract class RunOnUpdateComponent extends RenderableComponent {
    private queue;
    private swap;
    runOnUpdate(...fns: RunOnUpdateFn<this>[]): this;
    onUpdate(): this;
}
