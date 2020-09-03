"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalContext = void 0;
var getGlobalCanvas_1 = require("./getGlobalCanvas");
var CONTEXT = null;
function getGlobalContext() {
    if (CONTEXT === null) {
        CONTEXT = getGlobalCanvas_1.getGlobalCanvas().getContext("2d");
    }
    return CONTEXT;
}
exports.getGlobalContext = getGlobalContext;
