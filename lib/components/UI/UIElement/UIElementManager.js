"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIElementManager = void 0;
const Manager_1 = require("@aicacia/ecs/lib/Manager");
class UIElementManager extends Manager_1.Manager {
    constructor() {
        super(...arguments);
        this.layers = new Map();
        this.sortFunction = (a, b) => {
            return a
                .getEntity()
                .flatMap((aEntity) => b.getEntity().map((bEntity) => aEntity.getDepth() - bEntity.getDepth()))
                .unwrapOr(0);
        };
    }
    isEmpty() {
        return this.layers.size === 0;
    }
    getLayers() {
        return Array.from(this.layers.entries()).sort(([aLayer, _aElements], [bLayer, _bElements]) => aLayer - bLayer);
    }
    getComponents() {
        return [].concat(...this.getLayers().map(([_layer, elements]) => elements));
    }
    addComponent(uiElement) {
        this.getOrCreateLayer(uiElement.getLayer()).push(uiElement);
        return this;
    }
    removeComponent(uiElement) {
        const layerIndex = uiElement.getLayer(), layer = this.layers.get(layerIndex);
        if (layer) {
            const index = layer.indexOf(uiElement);
            if (index !== -1) {
                layer.splice(index, 1);
                if (layer.length === 0) {
                    this.layers.delete(layerIndex);
                }
            }
        }
        return this;
    }
    sort() {
        for (const layer of this.layers.values()) {
            layer.sort(this.sortFunction);
        }
        return this;
    }
    onInit() {
        return this;
    }
    onUpdate() {
        return this;
    }
    onAfterUpdate() {
        return this;
    }
    getOrCreateLayer(layerIndex) {
        const layer = this.layers.get(layerIndex);
        if (layer) {
            return layer;
        }
        else {
            const newLayer = [];
            this.layers.set(layerIndex, newLayer);
            return newLayer;
        }
    }
}
exports.UIElementManager = UIElementManager;
