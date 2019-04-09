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

  getBody() {
    return this.body;
  }

  onAdd() {
    const world2d = this.getPlugin(World2D).expect(
        "Body2D Component requires a World2D Plugin"
      ),
      transform2d = this.getComponent(Transform2D).expect(
        "Body2D Component requires a Transform2D Component"
      );

    world2d.getWorld().addBody(this.body);

    this.body.setPosition(transform2d.getPosition());
    this.body.setRotation(transform2d.getRotation());

    return this;
  }

  onRemove() {
    const world2d = this.getPlugin(World2D).expect(
      "Body2D Component requires a World2D Plugin"
    );

    world2d.getWorld().removeBody(this.body);

    return this;
  }

  onUpdate() {
    const transform2d = this.getComponent(Transform2D).expect(
      "Body2D Component requires a Transform2D Component"
    );

    transform2d.setLocalPosition(this.body.getPosition());
    transform2d.setLocalRotation(this.body.getRotation());

    return this;
  }
}
