"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalContext = void 0;
var core_1 = require("@aicacia/core");
var getGlobalCanvas_1 = require("./getGlobalCanvas");
var CONTEXT = core_1.none();
function getGlobalContext() {
    if (CONTEXT.isSome()) {
        return CONTEXT.unwrap();
    }
    else {
        var context = getGlobalCanvas_1.getGlobalCanvas().getContext("2d");
        CONTEXT.replace(context);
        return context;
    }
}
exports.getGlobalContext = getGlobalContext;
