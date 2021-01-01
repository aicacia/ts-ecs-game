import { Option } from "@aicacia/core";
import { Entity } from "@aicacia/ecs";
import { UIElement } from "./UIElement";
export declare enum ContainerDirection {
    Row = "row",
    RowReverse = "row-reverse",
    Column = "column",
    ColumnReverse = "column-reverse"
}
export declare enum ContainerWrap {
    NoWrap = "no-wrap",
    Wrap = "wrap",
    WrapReverse = "wrap-reverse"
}
export declare enum ContainerJustifyContent {
    Start = "start",
    End = "end",
    Center = "center",
    SpaceBetween = "space-between",
    SpaceAround = "space-around",
    SpaceEvenly = "space-evenly"
}
export declare enum ContainerAlignItems {
    Start = "start",
    End = "end",
    Center = "center",
    Stretch = "stretch",
    Baseline = "baseline"
}
export declare enum ContainerAlignContent {
    Start = "start",
    End = "end",
    Center = "center",
    Stretch = "stretch",
    SpaceBetween = "space-between",
    SpaceAround = "space-around",
    SpaceEvenly = "space-evenly"
}
export declare class UIContainer extends UIElement {
    private width;
    private height;
    private direction;
    private wrap;
    private justifyContent;
    private alignItems;
    private alignContent;
    static getRootUIContainer(entity: Entity): Option<UIContainer>;
    static getRequiredRootUIContainer(entity: Entity): UIContainer;
    getWidth(): Option<number>;
    setWidth(width: number): this;
    removeWidth(): this;
    getHeight(): Option<number>;
    setHeight(height: number): this;
    removeHeight(): this;
    getDirection(): ContainerDirection;
    setDirection(direction: ContainerDirection): this;
    getWrap(): ContainerWrap;
    setWrap(wrap: ContainerWrap): this;
    getJustifyContent(): ContainerJustifyContent;
    setJustifyContent(justifyContent: ContainerJustifyContent): this;
    getAlignItems(): ContainerAlignItems;
    setAlignItems(alignItems: ContainerAlignItems): this;
    getAlignContent(): ContainerAlignContent;
    setAlignContent(alignContent: ContainerAlignContent): this;
}
