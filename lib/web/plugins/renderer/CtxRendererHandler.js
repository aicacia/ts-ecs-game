"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxRendererHandler = void 0;
var tslib_1 = require("tslib");
var RendererHandler_1 = require("../../../plugins/renderer/RendererHandler");
var CtxRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(CtxRendererHandler, _super);
    function CtxRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtxRendererHandler.prototype.getCtx = function () {
        return this.getRequiredRenderer().getCtx();
    };
    CtxRendererHandler.prototype.getCamera = function () {
        return this.getRequiredRenderer().getCamera();
    };
    CtxRendererHandler.prototype.getScale = function () {
        return this.getRequiredRenderer().getScale();
    };
    CtxRendererHandler.rendererHandlerPriority = 0;
    return CtxRendererHandler;
}(RendererHandler_1.RendererHandler));
exports.CtxRendererHandler = CtxRendererHandler;
