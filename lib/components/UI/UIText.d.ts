import { UIElement } from "./UIElement";
export declare enum TextAlign {
    Start = "start",
    Left = "left",
    Right = "right",
    Center = "center"
}
export declare enum TextBaseline {
    Top = "top",
    Hanging = "hanging",
    Middle = "middle",
    Alphabetic = "alphabetic",
    Ideographic = "ideographic",
    Bottom = "bottom"
}
export declare enum TextDirection {
    LeftToRight = "ltr",
    RightToLeft = "rtl",
    Inherit = "inherit"
}
export declare class UIText extends UIElement {
    private text;
    private font;
    private size;
    private align;
    private baseline;
    private direction;
    getText(): string;
    setText(text: string): this;
    getAlign(): TextAlign;
    setAlign(align: TextAlign): this;
    getBaseline(): TextBaseline;
    setBaseline(baseline: TextBaseline): this;
    getDirection(): TextDirection;
    setDirection(direction: TextDirection): this;
    getFont(): string;
    setFont(font: string): this;
    getSize(): number;
    setSize(size: number): this;
    forceResize(): this;
}
