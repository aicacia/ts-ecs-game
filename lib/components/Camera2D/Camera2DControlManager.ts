import { DefaultManager } from "../../sceneGraph";
import { Camera2DControl } from "./Camera2DControl";

export class Camera2DControlManager extends DefaultManager<Camera2DControl> {
  static managerName = "engine.Camera2DControlManager";
}
