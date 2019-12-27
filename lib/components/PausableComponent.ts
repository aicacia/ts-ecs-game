import { Control } from "../plugins";
import { Component } from "../sceneGraph";

export class PausableComponent extends Component {
  shouldUpdate() {
    return !this.getRequiredPlugin(Control).isPaused();
  }
}
