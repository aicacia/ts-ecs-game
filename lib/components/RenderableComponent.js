"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderableComponent = void 0;
const ecs_1 = require("@aicacia/ecs");
class RenderableComponent extends ecs_1.Component {
    constructor() {
        super(...arguments);
        this.renderable = true;
    }
    getRenderable() {
        return this.renderable;
    }
    setRenderable(renderable = true) {
        this.renderable = renderable;
        return this;
    }
}
exports.RenderableComponent = RenderableComponent;
