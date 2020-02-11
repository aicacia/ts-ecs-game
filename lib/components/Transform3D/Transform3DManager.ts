import { Manager } from "../../sceneGraph";
import { Transform3D } from "./Transform3D";

export class Transform3DManager extends Manager<Transform3D> {
  static managerName = "engine.Transform3DManager";
}
