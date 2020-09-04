import { Option } from "@aicacia/core";
import { ImageAsset } from "../../../plugins/assets/ImageAsset";
export declare class WebImageAsset extends ImageAsset {
    private image;
    private src;
    constructor(src: string);
    getImage(): Option<HTMLImageElement>;
    getWidth(): number;
    getHeight(): number;
    protected loadAsset(): Promise<void>;
    protected unloadAsset(): Promise<void>;
}
