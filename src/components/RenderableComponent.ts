import { Component } from "../sceneGraph";

export class RenderableComponent extends Component {
  private renderable = true;

  getRenderable() {
    return this.renderable;
  }
  setRenderable(renderable = true) {
    this.renderable = renderable;
    return this;
  }
}
