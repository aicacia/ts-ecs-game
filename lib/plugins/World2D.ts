import { World } from "../external/collide_2d";
import { Plugin } from "../sceneGraph";

export class World2D extends Plugin {
  static pluginName = "engine.World2D";
  private world = new World();

  getWorld() {
    return this.world;
  }

  onUpdate() {
    this.world.run();
    return this;
  }
}
