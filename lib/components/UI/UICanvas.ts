import { UIElement } from "./UIElement";

export class UICanvas extends UIElement {
  static requiredComponents = [Cam];
  static requiredPlugins = [Time];
}
