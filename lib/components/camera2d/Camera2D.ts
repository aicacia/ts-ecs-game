import { mat2d, vec4 } from "gl-matrix";
import { Component } from "../../sceneGraph";

export class Camera2D extends Component {
  static Manager = null as any;
  static componentName = "engine.Camera2D";

  private width: number = 1.0;
  private height: number = 1.0;
  private aspect: number = 1.0;

  private orthographicSize: number = 1;
  private minOrthographicSize = Number.EPSILON;
  private maxOrthographicSize = 1024;

  private projection = mat2d.create();
  private view = mat2d.create();

  private needsUpdate = true;
  private background: vec4 = vec4.create();

  getBackground() {
    return this.background;
  }
  setBackground(background: vec4) {
    vec4.copy(this.background, background);
    return this;
  }

  set(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.aspect = width / height;
    this.needsUpdate = true;
    return this;
  }
  getWidth() {
    return this.width;
  }
  setWidth(width: number) {
    return this.set(width, this.height);
  }
  getHeight() {
    return this.height;
  }
  setHeight(height: number) {
    return this.set(this.width, height);
  }
  getAspect() {
    return this.aspect;
  }

  getOrthographicSize() {
    return this.orthographicSize;
  }
  setOrthographicSize(orthographicSize: number) {
    this.orthographicSize =
      orthographicSize < this.minOrthographicSize
        ? this.minOrthographicSize
        : orthographicSize > this.maxOrthographicSize
        ? this.maxOrthographicSize
        : orthographicSize;
    this.needsUpdate = true;
    return this;
  }
  getMinOrthographicSize() {
    return this.minOrthographicSize;
  }
  setMinOrthographicSize(minOrthographicSize: number) {
    this.minOrthographicSize = minOrthographicSize;
    this.needsUpdate = true;
    return this;
  }
  getMaxOrthographicSize() {
    return this.minOrthographicSize;
  }
  setMaxOrthographicSize(maxOrthographicSize: number) {
    this.maxOrthographicSize = maxOrthographicSize;
    this.needsUpdate = true;
    return this;
  }

  getView() {
    this.getEntity()
      .flatMap(entity => entity.getComponent(Transform2D))
      .map(transform => mat2d.invert(this.view, transform.getMatrix()));
    return this.view;
  }

  getProjection() {
    if (this.needsUpdate) {
      this.updateProjection();
    }
    return this.projection;
  }

  setActive() {
    this.getManager<Camera2DManager>().map(manager => manager.setActive(this));
    return this;
  }
  updateProjection() {
    const right = this.orthographicSize * this.aspect,
      left = -right,
      top = this.orthographicSize,
      bottom = -top,
      width = right - left,
      height = top - bottom,
      x = (right + left) / width,
      y = (top + bottom) / height;

    mat2d.set(this.projection, 2 / width, 0.0, 0.0, 2 / height, -x, -y);
    this.needsUpdate = false;

    return this;
  }
}

import { Transform2D } from "../transform2d";
import { Camera2DManager } from "./Camera2DManager";

Camera2D.Manager = Camera2DManager;
