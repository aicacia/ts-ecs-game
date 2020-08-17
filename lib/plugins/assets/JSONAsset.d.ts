import { Option } from "@aicacia/core";
import { IJSON } from "@aicacia/json";
import { Asset } from "./Asset";
export declare class JSONAsset extends Asset {
    private json;
    private src;
    private options?;
    constructor(src: RequestInfo, options?: RequestInit);
    getJSON(): Option<IJSON>;
    protected loadAsset(): Promise<void>;
    protected unloadAsset(): Promise<void>;
}
