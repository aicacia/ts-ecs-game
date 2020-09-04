import { getGlobalContext } from "./getGlobalContext";
import { getGlobalCanvas } from "./getGlobalCanvas";

export const BASE_SIZE = 16,
  INV_BASE_SIZE = 1 / BASE_SIZE;

export function getTextWidth(font: string, fontSize: number, text: string) {
  return getTextUnitWidth(font, text) * fontSize;
}

export function getTextUnitWidth(font: string, text: string): number {
  const ctx = getGlobalContext();

  ctx.save();
  ctx.font = `${BASE_SIZE}px ${font}`;
  const metrics = ctx.measureText(text);
  ctx.restore();

  return metrics.width * INV_BASE_SIZE;
}

const HEIGHT_CACHE: Record<string, number> = {},
  SIZE = 128;

export function getTextHeight(font: string, fontSize: number) {
  return getTextUnitHeight(font) * fontSize;
}

export function getTextUnitHeight(font: string): number {
  let result = HEIGHT_CACHE[font];

  if (!result) {
    const canvas = getGlobalCanvas(),
      ctx = getGlobalContext(),
      size = SIZE,
      halfSize = size * 0.5;

    canvas.width = size;
    canvas.height = size;

    ctx.save();

    ctx.font = `${BASE_SIZE}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("fißgPauljMPÜÖÄ", halfSize, halfSize);

    const data = ctx.getImageData(0, 0, size, size).data;

    ctx.restore();

    let firstY = -1;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const alpha = data[(size * y + x) * 4 + 3];

        if (alpha > 0) {
          firstY = y;
          break;
        }
      }
      if (firstY >= 0) {
        break;
      }
    }

    let lastY = -1;
    for (let y = size; y > 0; y--) {
      for (let x = 0; x < size; x++) {
        const alpha = data[(size * y + x) * 4 + 3];

        if (alpha > 0) {
          lastY = y;
          break;
        }
      }
      if (lastY >= 0) {
        break;
      }
    }

    result = (lastY - firstY) * INV_BASE_SIZE;
    HEIGHT_CACHE[font] = result;
  }

  return result;
}
