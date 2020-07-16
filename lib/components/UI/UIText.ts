import { getTextHeight, getTextWidth } from "../../utils/getTextDimensions";
import { UIElement } from "./UIElement";

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
  private text: string = "";
  private font: string = "sans-serif";
  private size: number = 16;
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

  getCtxFontStyle(scale: number) {
    return `${this.size * scale}em ${this.font}`;
  }

  getHTMLFontStyle() {
    return `${this.size}px ${this.font}`;
  }

  forceResize() {
    const fontStyle = this.getHTMLFontStyle();
    this.width = getTextWidth(fontStyle, this.text);
    this.height = getTextHeight(fontStyle);
    return this;
  }
}
