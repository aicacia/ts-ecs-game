"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIContainer = exports.ContainerAlignContent = exports.ContainerAlignItems = exports.ContainerJustifyContent = exports.ContainerWrap = exports.ContainerDirection = void 0;
const core_1 = require("@aicacia/core");
const UIElement_1 = require("./UIElement");
var ContainerDirection;
(function (ContainerDirection) {
    ContainerDirection["Row"] = "row";
    ContainerDirection["RowReverse"] = "row-reverse";
    ContainerDirection["Column"] = "column";
    ContainerDirection["ColumnReverse"] = "column-reverse";
})(ContainerDirection = exports.ContainerDirection || (exports.ContainerDirection = {}));
var ContainerWrap;
(function (ContainerWrap) {
    ContainerWrap["NoWrap"] = "no-wrap";
    ContainerWrap["Wrap"] = "wrap";
    ContainerWrap["WrapReverse"] = "wrap-reverse";
})(ContainerWrap = exports.ContainerWrap || (exports.ContainerWrap = {}));
var ContainerJustifyContent;
(function (ContainerJustifyContent) {
    ContainerJustifyContent["Start"] = "start";
    ContainerJustifyContent["End"] = "end";
    ContainerJustifyContent["Center"] = "center";
    ContainerJustifyContent["SpaceBetween"] = "space-between";
    ContainerJustifyContent["SpaceAround"] = "space-around";
    ContainerJustifyContent["SpaceEvenly"] = "space-evenly";
})(ContainerJustifyContent = exports.ContainerJustifyContent || (exports.ContainerJustifyContent = {}));
var ContainerAlignItems;
(function (ContainerAlignItems) {
    ContainerAlignItems["Start"] = "start";
    ContainerAlignItems["End"] = "end";
    ContainerAlignItems["Center"] = "center";
    ContainerAlignItems["Stretch"] = "stretch";
    ContainerAlignItems["Baseline"] = "baseline";
})(ContainerAlignItems = exports.ContainerAlignItems || (exports.ContainerAlignItems = {}));
var ContainerAlignContent;
(function (ContainerAlignContent) {
    ContainerAlignContent["Start"] = "start";
    ContainerAlignContent["End"] = "end";
    ContainerAlignContent["Center"] = "center";
    ContainerAlignContent["Stretch"] = "stretch";
    ContainerAlignContent["SpaceBetween"] = "space-between";
    ContainerAlignContent["SpaceAround"] = "space-around";
    ContainerAlignContent["SpaceEvenly"] = "space-evenly";
})(ContainerAlignContent = exports.ContainerAlignContent || (exports.ContainerAlignContent = {}));
function getRootUIContainer(entity, fallback) {
    return entity
        .getParent()
        .flatMap((parent) => getRootUIContainer(parent, parent.getComponent(UIContainer).or(fallback)))
        .or(fallback);
}
class UIContainer extends UIElement_1.UIElement {
    constructor() {
        super(...arguments);
        this.width = core_1.none();
        this.height = core_1.none();
        this.direction = ContainerDirection.Row;
        this.wrap = ContainerWrap.NoWrap;
        this.justifyContent = ContainerJustifyContent.SpaceEvenly;
        this.alignItems = ContainerAlignItems.Start;
        this.alignContent = ContainerAlignContent.Start;
    }
    static getRootUIContainer(entity) {
        return getRootUIContainer(entity, entity.getComponent(UIContainer));
    }
    static getRequiredRootUIContainer(entity) {
        return UIContainer.getRootUIContainer(entity).expect("UIContainer failed to get a required Root");
    }
    getWidth() {
        return this.width;
    }
    setWidth(width) {
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
    setHeight(height) {
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
    setDirection(direction) {
        this.direction = direction;
        return this;
    }
    getWrap() {
        return this.wrap;
    }
    setWrap(wrap) {
        this.wrap = wrap;
        return this;
    }
    getJustifyContent() {
        return this.justifyContent;
    }
    setJustifyContent(justifyContent) {
        this.justifyContent = justifyContent;
        return this;
    }
    getAlignItems() {
        return this.alignItems;
    }
    setAlignItems(alignItems) {
        this.alignItems = alignItems;
        return this;
    }
    getAlignContent() {
        return this.alignContent;
    }
    setAlignContent(alignContent) {
        this.alignContent = alignContent;
        return this;
    }
}
exports.UIContainer = UIContainer;
