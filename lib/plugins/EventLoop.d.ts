import { Input } from "./input";
import { Plugin } from "@aicacia/ecs/lib/Plugin";
export declare class EventLoop extends Plugin {
    static requiredPlugins: (typeof Input)[];
    private id;
    private running;
    onInit(): this;
    onRemove(): this;
    start: () => void;
    stop(): this;
    isStopped(): boolean;
    private run;
    private request;
}
