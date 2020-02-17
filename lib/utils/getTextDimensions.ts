import { getGlobalContext } from "./getGlobalContext";

export function getTextWidth(fontStyle: string, text: string): number {
  const ctx = getGlobalContext();

  ctx.save();
  ctx.font = fontStyle;
  const metrics = ctx.measureText(text);
  ctx.restore();

  return metrics.width;
}

const HEIGHT_CACHE: Record<string, number> = {};

export function getTextHeight(fontStyle: string): number {
  let result = HEIGHT_CACHE[fontStyle];

  if (!result) {
    const body = document.getElementsByTagName("body")[0],
      dummy = document.createElement("div"),
      dummyText = document.createTextNode("M");

    dummy.appendChild(dummyText);
    dummy.setAttribute("style", fontStyle + ";position:absolute;top:0;left:0");
    body.appendChild(dummy);
    result = dummy.offsetHeight;

    HEIGHT_CACHE[fontStyle] = result;
    body.removeChild(dummy);
  }

  return result;
}
