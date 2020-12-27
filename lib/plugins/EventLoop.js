"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLoop = void 0;
const raf = require("raf");
const Plugin_1 = require("@aicacia/ecs/lib/Plugin");
class EventLoop extends Plugin_1.Plugin {
    constructor(input) {
        super();
        this.id = null;
        this.running = false;
        this.start = () => {
            if (!this.running) {
                this.running = true;
                this.request();
            }
        };
        this.run = (_ms) => {
            this.id = null;
            this.getRequiredScene().update();
            this.running = false;
            return this;
        };
        this.input = input;
        this.input.on("event", this.start);
    }
    getInput() {
        return this.input;
    }
    setInput(input) {
        this.input.off("event", this.start);
        this.input = input;
        this.input.on("event", this.start);
        return this;
    }
    stop() {
        this.running = false;
        if (this.id !== null) {
            raf.cancel(this.id);
            this.id = null;
        }
        return this;
    }
    isStopped() {
        return this.running === false;
    }
    request() {
        this.id = raf(this.run);
        return this;
    }
    onInit() {
        this.start();
        return this;
    }
}
exports.EventLoop = EventLoop;
