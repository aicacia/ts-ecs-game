import { vec2 } from "gl-matrix";
import { RenderableComponent } from "../../RenderableComponent";
export declare class UIElement extends RenderableComponent {
    protected width: number;
    protected height: number;
    private layer;
    getLocalAABB(min: vec2, max: vec2): void;
    getAABB(min: vec2, max: vec2): void;
    getWidth(): number;
    setWidth(width: number): this;
    getHeight(): number;
    setHeight(height: number): this;
    getLayer(): number;
    setLayer(layer: number): this;
}
