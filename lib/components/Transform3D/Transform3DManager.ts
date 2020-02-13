import { DefaultManager } from "../../sceneGraph";
import { Transform3D } from "./Transform3D";

export class Transform3DManager extends DefaultManager<Transform3D> {
  static managerName = "engine.Transform3DManager";
}
