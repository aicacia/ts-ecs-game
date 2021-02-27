import { SpriteManager } from "../../../../components/Sprite";
import { TransformComponent } from "../../../../components/TransformComponent";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d } from "gl-matrix";
import { WebImageAsset } from "../../assets/WebImageAsset";

const MAT2_0 = mat2d.create();

export class SpriteCtxRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(SpriteManager).ifSome((spriteManager) => {
      const renderer = this.getRequiredRenderer();

      for (const sprite of spriteManager.getComponents()) {
        const imageOption = sprite
          .getImageAsset<WebImageAsset>()
          .flatMap((webImageAsset) => webImageAsset.getImage());

        if (sprite.getRenderable() && imageOption.isSome()) {
          const image = imageOption.unwrap(),
            transform = TransformComponent.getRequiredTransform(
              sprite.getRequiredEntity()
            );

          renderer.render((ctx) => {
            const width = sprite.getWidth(),
              height = sprite.getHeight(),
              halfWidth = width * 0.5,
              halfHeight = height * 0.5;

            ctx.scale(1, -1);
            ctx.drawImage(
              image,
              sprite.getClipX(),
              sprite.getClipY(),
              sprite.getClipWidth(),
              sprite.getClipHeight(),
              -halfWidth,
              -halfHeight,
              width,
              height
            );
          }, transform.getMatrix2d(MAT2_0));
        }
      }
    });

    return this;
  }
}
