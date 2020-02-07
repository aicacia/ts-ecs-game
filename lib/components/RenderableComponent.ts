import { Component } from "../sceneGraph";

export class RenderableComponent extends Component {
  private renderable: boolean = true;

  getRenderable() {
    return this.renderable;
  }
  setRenderable(renderable: boolean = true) {
    this.renderable = renderable;
    return this;
  }
}
