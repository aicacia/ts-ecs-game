import { UIElement } from "./UIElement";
import {
  getTextHeight,
  getTextWidth,
  BASE_SIZE,
} from "../../utils/getTextDimensions";

export enum TextAlign {
  Start = "start",
  Left = "left",
  Right = "right",
  Center = "center",
}

export enum TextBaseline {
  Top = "top",
  Hanging = "hanging",
  Middle = "middle",
  Alphabetic = "alphabetic",
  Ideographic = "ideographic",
  Bottom = "bottom",
}

export enum TextDirection {
  LeftToRight = "ltr",
  RightToLeft = "rtl",
  Inherit = "inherit",
}

export class UIText extends UIElement {
  private text = "";
  private font = "sans-serif";
  private size = 1;
  private align: TextAlign = TextAlign.Center;
  private baseline: TextBaseline = TextBaseline.Middle;
  private direction: TextDirection = TextDirection.Inherit;

  getText() {
    return this.text;
  }
  setText(text: string) {
    this.text = text;
    return this.forceResize();
  }

  getAlign() {
    return this.align;
  }
  setAlign(align: TextAlign) {
    this.align = align;
    return this;
  }

  getBaseline() {
    return this.baseline;
  }
  setBaseline(baseline: TextBaseline) {
    this.baseline = baseline;
    return this;
  }

  getDirection() {
    return this.direction;
  }
  setDirection(direction: TextDirection) {
    this.direction = direction;
    return this;
  }

  getFont() {
    return this.font;
  }
  setFont(font: string) {
    this.font = font;
    return this.forceResize();
  }

  getSize() {
    return this.size;
  }
  setSize(size: number) {
    this.size = size;
    return this.forceResize();
  }

  getCtxFontStyle(scale = 1) {
    return `${this.size * scale}px ${this.font}`;
  }

  getHTMLFontStyle() {
    return `${this.size * BASE_SIZE}px ${this.font}`;
  }

  forceResize() {
    this.width = getTextWidth(this.font, this.size, this.text);
    this.height = getTextHeight(this.font, this.size);
    return this;
  }
}
