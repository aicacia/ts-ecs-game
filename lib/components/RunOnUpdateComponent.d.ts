import { RenderableComponent } from "./RenderableComponent";
export declare type RunOnUpdateFn = () => void;
export declare abstract class RunOnUpdateComponent extends RenderableComponent {
    private queue;
    private swap;
    enqueue(...events: RunOnUpdateFn[]): this;
    onUpdate(): this;
}
