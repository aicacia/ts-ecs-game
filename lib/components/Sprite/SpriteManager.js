"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteManager = void 0;
const ecs_1 = require("@aicacia/ecs");
class SpriteManager extends ecs_1.Manager {
    constructor() {
        super(...arguments);
        this.layers = {};
        this.sortFunction = (a, b) => {
            return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
        };
    }
    isEmpty() {
        return Object.values(this.layers).length === 0;
    }
    getComponents() {
        return [].concat(...Object.values(this.layers));
    }
    addComponent(sprite) {
        this.getOrCreateLayer(sprite.getLayer()).push(sprite);
        return this;
    }
    removeComponent(sprite) {
        const layerIndex = sprite.getLayer(), layer = this.layers[layerIndex];
        if (layer) {
            const index = layer.indexOf(sprite);
            if (index !== -1) {
                layer.splice(index, 1);
                if (layer.length === 0) {
                    delete this.layers[layerIndex];
                }
            }
        }
        return this;
    }
    sort() {
        Object.values(this.layers).forEach((layer) => layer.sort(this.sortFunction));
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
        const layer = this.layers[layerIndex];
        if (layer) {
            return layer;
        }
        else {
            const newLayer = [];
            this.layers[layerIndex] = newLayer;
            return newLayer;
        }
    }
}
exports.SpriteManager = SpriteManager;
