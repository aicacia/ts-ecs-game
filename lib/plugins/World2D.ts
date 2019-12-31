import { World } from "../external/collide_2d";
import { Plugin } from "../sceneGraph";
import { Time } from "./Time";

export class World2D extends Plugin {
  static pluginName = "engine.World2D";
  private world = new World();

  getWorld() {
    return this.world;
  }

  onUpdate() {
    this.world.update(this.getRequiredPlugin(Time).getDelta());
    return this;
  }
}
