import { Input } from "./input";
import { Plugin } from "../Plugin";
export declare class EventLoop extends Plugin {
    private input;
    private id;
    private running;
    constructor(input: Input);
    getInput(): Input;
    setInput(input: Input): this;
    start: () => void;
    stop(): this;
    isStopped(): boolean;
    private run;
    private request;
    onInit(): this;
}
