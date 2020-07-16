import { SpriteManager } from "../../../components";
import { TransformComponent } from "../../../components/TransformComponent";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d } from "gl-matrix";

const MAT2_0 = mat2d.create();

export class CtxSpriteRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(SpriteManager).ifSome((spriteManager) => {
      const renderer = this.getRequiredRenderer();

      spriteManager.getComponents().forEach((sprite) => {
        const image = sprite.getImage();

        if (sprite.getRenderable()) {
          image.ifSome((img) =>
            sprite
              .getEntity()
              .flatMap(TransformComponent.getTransform)
              .map((transform) =>
                renderer.render((ctx) => {
                  const width = sprite.getWidth(),
                    height = sprite.getHeight(),
                    halfWidth = width * 0.5,
                    halfHeight = height * 0.5;

                  ctx.scale(1, -1);
                  ctx.drawImage(
                    img,
                    sprite.getClipX(),
                    sprite.getClipY(),
                    sprite.getClipWidth(),
                    sprite.getClipHeight(),
                    -halfWidth,
                    -halfHeight,
                    width,
                    height
                  );
                }, transform.getMatrix2d(MAT2_0))
              )
          );
        }
      });
    });

    return this;
  }
}
