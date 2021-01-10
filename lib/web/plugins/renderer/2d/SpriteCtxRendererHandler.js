"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteCtxRendererHandler = void 0;
const Sprite_1 = require("../../../../components/Sprite");
const TransformComponent_1 = require("../../../../components/TransformComponent");
const CtxRendererHandler_1 = require("../CtxRendererHandler");
const gl_matrix_1 = require("gl-matrix");
const MAT2_0 = gl_matrix_1.mat2d.create();
class SpriteCtxRendererHandler extends CtxRendererHandler_1.CtxRendererHandler {
    onRender() {
        this.getManager(Sprite_1.SpriteManager).ifSome((spriteManager) => {
            const renderer = this.getRequiredRenderer();
            for (const sprite of spriteManager.getComponents()) {
                const image = sprite
                    .getImageAsset()
                    .flatMap((webImageAsset) => webImageAsset.getImage());
                if (sprite.getRenderable()) {
                    image.ifSome((img) => sprite
                        .getEntity()
                        .flatMap(TransformComponent_1.TransformComponent.getTransform)
                        .map((transform) => renderer.render((ctx) => {
                        const width = sprite.getWidth(), height = sprite.getHeight(), halfWidth = width * 0.5, halfHeight = height * 0.5;
                        ctx.scale(1, -1);
                        ctx.drawImage(img, sprite.getClipX(), sprite.getClipY(), sprite.getClipWidth(), sprite.getClipHeight(), -halfWidth, -halfHeight, width, height);
                    }, transform.getMatrix2d(MAT2_0))));
                }
            }
        });
        return this;
    }
}
exports.SpriteCtxRendererHandler = SpriteCtxRendererHandler;
