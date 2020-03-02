import { SpriteManager, Transform2D } from "../../../components";
import { CtxRendererHandler } from "../CtxRendererHandler";

export class CtxSpriteRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(SpriteManager).ifSome(spriteManager => {
      const renderer = this.getRequiredRenderer();

      spriteManager.getComponents().forEach(sprite => {
        const image = sprite.getImage();

        if (sprite.getRenderable()) {
          image.ifSome(img =>
            sprite.getComponent(Transform2D).ifSome(transform2d =>
              renderer.render(ctx => {
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
              }, transform2d.getMatrix())
            )
          );
        }
      });
    });

    return this;
  }
}
