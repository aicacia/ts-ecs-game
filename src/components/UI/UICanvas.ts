import { UIElement } from "./UIElement";
import { Camera2D } from "../Camera2D";
import { Camera3D } from "../Camera3D";

export class UICanvas extends UIElement {
  static requiredComponents = [[Camera2D, Camera3D]];
  static requiredPlugins = [];
}
