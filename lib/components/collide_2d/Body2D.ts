import { Body } from "../../external/collide_2d";
import { World2D } from "../../plugins/World2D";
import { Component } from "../../sceneGraph";
import { Transform2D } from "../2d";
import { Body2DManager } from "./Body2DManager";

export class Body2D extends Component {
  static componentName = "engine.Body2D";
  static Manager = Body2DManager;

  private body: Body;

  constructor(body: Body) {
    super();

    this.body = body;
  }

  onAdd() {
    this.getPlugin(World2D).map(world2d =>
      world2d.getWorld().addBody(this.body)
    );
    return this;
  }

  onRemove() {
    this.getPlugin(World2D).map(world2d =>
      world2d.getWorld().removeBody(this.body)
    );
    return this;
  }

  onUpdate() {
    this.getComponent(Transform2D).map(transform2d => {});
    return this;
  }
}
