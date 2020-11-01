import { ILoopHandler } from "./Loop";
import { Input } from "./plugins";
export declare class EventLoop {
    private input;
    private id;
    private running;
    private handler;
    constructor(input: Input, handler: ILoopHandler);
    getInput(): Input;
    setInput(input: Input): this;
    getHandler(): ILoopHandler;
    setHandler(handler: ILoopHandler): this;
    private start;
    stop(): this;
    isStopped(): boolean;
    private run;
    private request;
}
