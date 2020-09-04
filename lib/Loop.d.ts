export declare type ILoopHandler = (ms: number) => void;
export declare class Loop {
    private id;
    private running;
    private handler;
    private resolve?;
    constructor(handler: ILoopHandler);
    getHandler(): ILoopHandler;
    setHandler(handler: ILoopHandler): this;
    start(): Promise<void>;
    stop(): this;
    isStopped(): boolean;
    private run;
    private request;
}
