"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform3DManager = void 0;
var tslib_1 = require("tslib");
var sceneGraph_1 = require("../../sceneGraph");
var Transform3DManager = /** @class */ (function (_super) {
    tslib_1.__extends(Transform3DManager, _super);
    function Transform3DManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transform3DManager.prototype.onInit = function () {
        return this;
    };
    Transform3DManager.prototype.onUpdate = function () {
        return this;
    };
    Transform3DManager.prototype.onAfterUpdate = function () {
        return this;
    };
    return Transform3DManager;
}(sceneGraph_1.DefaultManager));
exports.Transform3DManager = Transform3DManager;
