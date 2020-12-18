import { RenderableComponent } from "../../RenderableComponent";
import { Transform2D } from "../../Transform2D";
import { Transform3D } from "../../Transform3D";
import { UIElementManager } from "./UIElementManager";
export declare class UIElement extends RenderableComponent {
    static Manager: typeof UIElementManager;
    static requiredComponents: (typeof Transform2D | typeof Transform3D)[][];
    private dirty;
    private layer;
    isDirty(): boolean;
    setDirty(dirty?: boolean): this;
    getLayer(): number;
    setLayer(layer: number): this;
}
