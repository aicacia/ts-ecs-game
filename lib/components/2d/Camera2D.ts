import { mat2d, vec2, vec3 } from "gl-matrix";
import { Component } from "../../sceneGraph";

const MAT2D_0 = mat2d.create();

export class Camera2D extends Component {
  static Manager = null as any;
  static componentName = "engine.Camera2D";

  private width: number = 1.0;
  private height: number = 1.0;
  private aspect: number = 1.0;

  private size: number = 1;
  private minSize = Number.EPSILON;
  private maxSize = Infinity;

  private projection = mat2d.create();
  private view = mat2d.create();

  private needsUpdate = true;
  private background: vec3 = vec3.create();

  getBackground() {
    return this.background;
  }
  setBackground(background: vec3) {
    vec3.copy(this.background, background);
    return this;
  }

  set(width: number, height: number) {
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.aspect = width / height;
      return this.setNeedsUpdate();
    } else {
      return this;
    }
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

  getSize() {
    return this.size;
  }
  setSize(size: number) {
    this.size =
      size < this.minSize
        ? this.minSize
        : size > this.maxSize
        ? this.maxSize
        : size;
    return this.setNeedsUpdate();
  }
  getMinSize() {
    return this.minSize;
  }
  setMinSize(minSize: number) {
    this.minSize = minSize;
    return this.setNeedsUpdate();
  }
  getMaxSize() {
    return this.minSize;
  }
  setMaxSize(maxSize: number) {
    this.maxSize = maxSize;
    return this.setNeedsUpdate();
  }

  getView() {
    this.getEntity()
      .flatMap(entity => entity.getComponent(Transform2D))
      .map(transform => mat2d.invert(this.view, transform.getMatrix()));
    return this.view;
  }

  getProjection() {
    return this.updateProjectionIfNeeded().projection;
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    this.needsUpdate = needsUpdate;
    return this;
  }

  updateProjectionIfNeeded() {
    if (this.needsUpdate) {
      return this.updateProjection();
    } else {
      return this;
    }
  }

  setActive() {
    this.getManager<Camera2DManager>().map(manager => manager.setActive(this));
    return this;
  }
  updateProjection() {
    const right = this.size * this.aspect,
      left = -right,
      top = this.size,
      bottom = -top,
      width = right - left,
      height = top - bottom,
      x = (right + left) / width,
      y = (top + bottom) / height;

    mat2d.set(this.projection, 2 / width, 0.0, 0.0, 2 / height, -x, -y);
    this.needsUpdate = false;

    return this;
  }

  toWorld(out: vec2, screen: vec2) {
    const mat = MAT2D_0;

    out[0] = 2.0 * (screen[0] / this.width) - 1.0;
    out[1] = -2.0 * (screen[1] / this.height) + 1.0;

    mat2d.mul(mat, this.projection, this.view);
    mat2d.invert(mat, mat);
    vec2.transformMat2d(out, out, mat);

    return out;
  }

  toScreen(out: vec2, world: vec2) {
    const mat = mat2d.mul(MAT2D_0, this.projection, this.view);

    vec2.transformMat2d(out, world, mat);

    out[0] = (out[0] + 1.0) * 0.5 * this.width;
    out[1] = (1.0 - out[1]) * 0.5 * this.height;

    return out;
  }
}

import { Camera2DManager } from "./Camera2DManager";
import { Transform2D } from "./Transform2D";

Camera2D.Manager = Camera2DManager;
