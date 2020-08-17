"use strict";
exports.__esModule = true;
exports.CtxSpriteRendererHandler = void 0;
var tslib_1 = require("tslib");
var components_1 = require("../../../components");
var TransformComponent_1 = require("../../../components/TransformComponent");
var CtxRendererHandler_1 = require("../CtxRendererHandler");
var gl_matrix_1 = require("gl-matrix");
var MAT2_0 = gl_matrix_1.mat2d.create();
var CtxSpriteRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(CtxSpriteRendererHandler, _super);
    function CtxSpriteRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtxSpriteRendererHandler.prototype.onRender = function () {
        var _this = this;
        this.getManager(components_1.SpriteManager).ifSome(function (spriteManager) {
            var renderer = _this.getRequiredRenderer();
            spriteManager.getComponents().forEach(function (sprite) {
                var image = sprite.getImage();
                if (sprite.getRenderable()) {
                    image.ifSome(function (img) {
                        return sprite
                            .getEntity()
                            .flatMap(TransformComponent_1.TransformComponent.getTransform)
                            .map(function (transform) {
                            return renderer.render(function (ctx) {
                                var width = sprite.getWidth(), height = sprite.getHeight(), halfWidth = width * 0.5, halfHeight = height * 0.5;
                                ctx.scale(1, -1);
                                ctx.drawImage(img, sprite.getClipX(), sprite.getClipY(), sprite.getClipWidth(), sprite.getClipHeight(), -halfWidth, -halfHeight, width, height);
                            }, transform.getMatrix2d(MAT2_0));
                        });
                    });
                }
            });
        });
        return this;
    };
    return CtxSpriteRendererHandler;
}(CtxRendererHandler_1.CtxRendererHandler));
exports.CtxSpriteRendererHandler = CtxSpriteRendererHandler;
