import { DefaultManager } from "../../sceneGraph";
import { Transform2D } from "./Transform2D";

export class Transform2DManager extends DefaultManager<Transform2D> {
  static managerName = "engine.Transform2DManager";
}
