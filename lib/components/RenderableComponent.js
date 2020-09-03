"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderableComponent = void 0;
var tslib_1 = require("tslib");
var sceneGraph_1 = require("../sceneGraph");
var RenderableComponent = /** @class */ (function (_super) {
    tslib_1.__extends(RenderableComponent, _super);
    function RenderableComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderable = true;
        return _this;
    }
    RenderableComponent.prototype.getRenderable = function () {
        return this.renderable;
    };
    RenderableComponent.prototype.setRenderable = function (renderable) {
        if (renderable === void 0) { renderable = true; }
        this.renderable = renderable;
        return this;
    };
    return RenderableComponent;
}(sceneGraph_1.Component));
exports.RenderableComponent = RenderableComponent;
