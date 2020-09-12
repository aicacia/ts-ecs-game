import { none, Option } from "@aicacia/core";
import { Entity } from "../../Entity";
import { UIElement } from "./UIElement";

export enum ContainerDirection {
  Row = "row",
  RowReverse = "row-reverse",
  Column = "column",
  ColumnReverse = "column-reverse",
}

export enum ContainerWrap {
  NoWrap = "no-wrap",
  Wrap = "wrap",
  WrapReverse = "wrap-reverse",
}

export enum ContainerJustifyContent {
  Start = "start",
  End = "end",
  Center = "center",
  SpaceBetween = "space-between",
  SpaceAround = "space-around",
  SpaceEvenly = "space-evenly",
}

export enum ContainerAlignItems {
  Start = "start",
  End = "end",
  Center = "center",
  Stretch = "stretch",
  Baseline = "baseline",
}

export enum ContainerAlignContent {
  Start = "start",
  End = "end",
  Center = "center",
  Stretch = "stretch",
  SpaceBetween = "space-between",
  SpaceAround = "space-around",
  SpaceEvenly = "space-evenly",
}

function getRootUIContainer(
  entity: Entity,
  fallback: Option<UIContainer>
): Option<UIContainer> {
  return entity
    .getParent()
    .flatMap((parent) =>
      getRootUIContainer(parent, parent.getComponent(UIContainer).or(fallback))
    )
    .or(fallback);
}

export class UIContainer extends UIElement {
  private width: Option<number> = none();
  private height: Option<number> = none();

  private direction: ContainerDirection = ContainerDirection.Row;
  private wrap: ContainerWrap = ContainerWrap.NoWrap;
  private justifyContent: ContainerJustifyContent =
    ContainerJustifyContent.SpaceEvenly;
  private alignItems: ContainerAlignItems = ContainerAlignItems.Start;
  private alignContent: ContainerAlignContent = ContainerAlignContent.Start;

  static getRootUIContainer(entity: Entity): Option<UIContainer> {
    return getRootUIContainer(entity, entity.getComponent(UIContainer));
  }
  static getRequiredRootUIContainer(entity: Entity): UIContainer {
    return UIContainer.getRootUIContainer(entity).expect(
      "UIContainer failed to get a required Root"
    );
  }

  getWidth() {
    return this.width;
  }
  setWidth(width: number) {
    this.width.replace(width);
    return this;
  }
  removeWidth() {
    this.width.clear();
    return this;
  }

  getHeight() {
    return this.height;
  }
  setHeight(height: number) {
    this.height.replace(height);
    return this;
  }
  removeHeight() {
    this.height.clear();
    return this;
  }

  getDirection() {
    return this.direction;
  }
  setDirection(direction: ContainerDirection) {
    this.direction = direction;
    return this;
  }

  getWrap() {
    return this.wrap;
  }
  setWrap(wrap: ContainerWrap) {
    this.wrap = wrap;
    return this;
  }

  getJustifyContent() {
    return this.justifyContent;
  }
  setJustifyContent(justifyContent: ContainerJustifyContent) {
    this.justifyContent = justifyContent;
    return this;
  }

  getAlignItems() {
    return this.alignItems;
  }
  setAlignItems(alignItems: ContainerAlignItems) {
    this.alignItems = alignItems;
    return this;
  }

  getAlignContent() {
    return this.alignContent;
  }
  setAlignContent(alignContent: ContainerAlignContent) {
    this.alignContent = alignContent;
    return this;
  }
}
