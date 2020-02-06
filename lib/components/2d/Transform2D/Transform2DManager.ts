import { Manager } from "../../../sceneGraph";
import { Transform2D } from "./Transform2D";

export class Transform2DManager extends Manager<Transform2D> {
  static managerName = "engine.Transform2DManager";
}
