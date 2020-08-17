import { Option } from "@aicacia/core";
import { Asset } from "./Asset";
export declare class ImageAsset extends Asset {
    private image;
    private src;
    constructor(src: string);
    getImage(): Option<HTMLImageElement>;
    protected loadAsset(): Promise<void>;
    protected unloadAsset(): Promise<void>;
}
