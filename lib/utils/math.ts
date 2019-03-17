import { mat2d, vec2 } from "gl-matrix";

export function composeMat2d(
  out: mat2d,
  position: vec2,
  scale: vec2,
  rotation: number
): mat2d {
  const sx = scale[0],
    sy = scale[1],
    c = Math.cos(rotation),
    s = Math.sin(rotation);

  out[0] = c * sx;
  out[1] = s * sx;
  out[2] = -s * sy;
  out[3] = c * sy;
  out[4] = position[0];
  out[5] = position[1];

  return out;
}

const decomposeMat2d_VEC2_0 = vec2.create();

export function decomposeMat2d(
  matrix: mat2d,
  position: vec2,
  scale: vec2
): number {
  const sx = vec2.len(vec2.set(decomposeMat2d_VEC2_0, matrix[0], matrix[1])),
    sy = vec2.len(vec2.set(decomposeMat2d_VEC2_0, matrix[2], matrix[3]));

  vec2.set(position, matrix[4], matrix[5]);
  vec2.set(scale, sx, sy);

  return Math.atan2(matrix[1], matrix[0]);
}