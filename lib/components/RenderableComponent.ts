import { Component } from "../sceneGraph";

export class RenderableComponent extends Component {
  private render: boolean = true;

  getRender() {
    return this.render;
  }
  setRender(render: boolean = true) {
    this.render = render;
    return this;
  }
}
