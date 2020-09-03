"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform2DManager = void 0;
var tslib_1 = require("tslib");
var sceneGraph_1 = require("../../sceneGraph");
var Transform2DManager = /** @class */ (function (_super) {
    tslib_1.__extends(Transform2DManager, _super);
    function Transform2DManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transform2DManager.prototype.onInit = function () {
        return this;
    };
    Transform2DManager.prototype.onUpdate = function () {
        return this;
    };
    Transform2DManager.prototype.onAfterUpdate = function () {
        return this;
    };
    return Transform2DManager;
}(sceneGraph_1.DefaultManager));
exports.Transform2DManager = Transform2DManager;
