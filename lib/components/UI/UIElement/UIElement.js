"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIElement = void 0;
const RenderableComponent_1 = require("../../RenderableComponent");
const Transform2D_1 = require("../../Transform2D");
const Transform3D_1 = require("../../Transform3D");
const UIElementManager_1 = require("./UIElementManager");
class UIElement extends RenderableComponent_1.RenderableComponent {
    constructor() {
        super(...arguments);
        this.dirty = true;
        this.layer = 0;
    }
    isDirty() {
        return this.dirty;
    }
    setDirty(dirty = true) {
        this.dirty = dirty === true;
        return this;
    }
    getLayer() {
        return this.layer;
    }
    setLayer(layer) {
        const managerOption = this.getManager();
        managerOption.ifSome((manager) => manager.removeComponent(this));
        this.layer = layer | 0;
        managerOption.ifSome((manager) => manager.addComponent(this));
        return this;
    }
}
exports.UIElement = UIElement;
UIElement.Manager = UIElementManager_1.UIElementManager;
UIElement.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
