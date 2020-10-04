"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIContainer = exports.ContainerAlignContent = exports.ContainerAlignItems = exports.ContainerJustifyContent = exports.ContainerWrap = exports.ContainerDirection = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var UIElement_1 = require("./UIElement");
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
        .flatMap(function (parent) {
        return getRootUIContainer(parent, parent.getComponent(UIContainer).or(fallback));
    })
        .or(fallback);
}
var UIContainer = /** @class */ (function (_super) {
    tslib_1.__extends(UIContainer, _super);
    function UIContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = core_1.none();
        _this.height = core_1.none();
        _this.direction = ContainerDirection.Row;
        _this.wrap = ContainerWrap.NoWrap;
        _this.justifyContent = ContainerJustifyContent.SpaceEvenly;
        _this.alignItems = ContainerAlignItems.Start;
        _this.alignContent = ContainerAlignContent.Start;
        return _this;
    }
    UIContainer.getRootUIContainer = function (entity) {
        return getRootUIContainer(entity, entity.getComponent(UIContainer));
    };
    UIContainer.getRequiredRootUIContainer = function (entity) {
        return UIContainer.getRootUIContainer(entity).expect("UIContainer failed to get a required Root");
    };
    UIContainer.prototype.getWidth = function () {
        return this.width;
    };
    UIContainer.prototype.setWidth = function (width) {
        this.width.replace(width);
        return this;
    };
    UIContainer.prototype.removeWidth = function () {
        this.width.clear();
        return this;
    };
    UIContainer.prototype.getHeight = function () {
        return this.height;
    };
    UIContainer.prototype.setHeight = function (height) {
        this.height.replace(height);
        return this;
    };
    UIContainer.prototype.removeHeight = function () {
        this.height.clear();
        return this;
    };
    UIContainer.prototype.getDirection = function () {
        return this.direction;
    };
    UIContainer.prototype.setDirection = function (direction) {
        this.direction = direction;
        return this;
    };
    UIContainer.prototype.getWrap = function () {
        return this.wrap;
    };
    UIContainer.prototype.setWrap = function (wrap) {
        this.wrap = wrap;
        return this;
    };
    UIContainer.prototype.getJustifyContent = function () {
        return this.justifyContent;
    };
    UIContainer.prototype.setJustifyContent = function (justifyContent) {
        this.justifyContent = justifyContent;
        return this;
    };
    UIContainer.prototype.getAlignItems = function () {
        return this.alignItems;
    };
    UIContainer.prototype.setAlignItems = function (alignItems) {
        this.alignItems = alignItems;
        return this;
    };
    UIContainer.prototype.getAlignContent = function () {
        return this.alignContent;
    };
    UIContainer.prototype.setAlignContent = function (alignContent) {
        this.alignContent = alignContent;
        return this;
    };
    return UIContainer;
}(UIElement_1.UIElement));
exports.UIContainer = UIContainer;
