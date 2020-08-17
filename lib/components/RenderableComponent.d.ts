import { Component } from "../sceneGraph";
export declare class RenderableComponent extends Component {
    private renderable;
    getRenderable(): boolean;
    setRenderable(renderable?: boolean): this;
}
