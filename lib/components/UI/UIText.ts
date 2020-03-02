import { getTextHeight, getTextWidth } from "../../utils/getTextDimensions";
import { UIElement } from "./UIElement";

export class UIText extends UIElement {
  private text: string = "";
  private font: string = "sans-serif";
  private size: string = "16px";

  getText() {
    return this.text;
  }
  setText(text: string) {
    this.text = text;
    return this.forceResize();
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
  setSize(size: string) {
    this.size = size;
    return this.forceResize();
  }

  forceResize() {
    const fontStyle = `${this.size} ${this.font}`;
    this.width = getTextWidth(fontStyle, this.text);
    this.height = getTextHeight(fontStyle);
    return this;
  }
}
