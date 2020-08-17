export declare class InputButton {
    private name;
    private value;
    private frameDown;
    private frameUp;
    constructor(name: string);
    getName(): string;
    getFrameDown(): number;
    getFrameUp(): number;
    getValue(): number;
    UNSAFE_setValue(value: number): this;
    UNSAFE_up(frame: number): this;
    UNSAFE_down(frame: number): this;
}
