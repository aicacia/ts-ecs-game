import { Component } from "@aicacia/ecs";
export declare class RenderableComponent extends Component {
    private renderable;
    getRenderable(): boolean;
    setRenderable(renderable?: boolean): this;
}
