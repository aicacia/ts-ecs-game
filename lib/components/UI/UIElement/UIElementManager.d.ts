import { Manager } from "../../../sceneGraph";
export declare class UIElementManager extends Manager<UIElement> {
    private layers;
    isEmpty(): boolean;
    getLayers(): [number, UIElement[]][];
    getComponents(): UIElement[];
    addComponent(uiElement: UIElement): this;
    removeComponent(uiElement: UIElement): this;
    sortFunction: (a: UIElement, b: UIElement) => number;
    sort(): this;
    onInit(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
    private getOrCreateLayer;
}
import { UIElement } from "./UIElement";
