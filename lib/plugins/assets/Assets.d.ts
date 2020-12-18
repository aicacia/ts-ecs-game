import { Option } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { Plugin } from "@aicacia/ecs/lib/Plugin";
import { Asset } from "./Asset";
export declare class Assets extends Plugin {
    private assetMap;
    private assets;
    private loadedAssets;
    private loadingPromises;
    private unloadingPromises;
    find(fn: (asset: Asset) => boolean): Option<Asset>;
    findWithName(name: string): Option<Asset>;
    findAll(fn: (asset: Asset) => boolean): Asset[];
    findAllWithName(name: string): Asset[];
    isLoading(): boolean;
    getAsset<T extends Asset = Asset>(uuid: string): Option<T>;
    getAssets(): readonly Asset[];
    getLoadedAssets(): readonly Asset[];
    getLoadingAssets(): Asset[];
    getUnloadingAssets(): Asset[];
    getUnloadedAssets(): readonly Asset[];
    addAsset(...assets: Asset[]): this;
    addAssets(assets: Asset[]): this;
    removeAsset(...assets: Asset[]): this;
    removeAssets(assets: Asset[]): this;
    loadAll(): Promise<void[]>;
    loadAllInBackground(): this;
    loadAssetInBackground(...assets: readonly Asset[]): this;
    loadAssetsInBackground(assets: readonly Asset[]): this;
    unloadAssetInBackground(...assets: readonly Asset[]): this;
    unloadAssetsInBackground(assets: readonly Asset[]): this;
    loadAsset(...assets: readonly Asset[]): Promise<void[]>;
    loadAssets(assets: readonly Asset[]): Promise<void[]>;
    unloadAsset(...assets: readonly Asset[]): Promise<void[]>;
    unloadAssets(assets: readonly Asset[]): Promise<void[]>;
    private _loadAsset;
    private _unloadAsset;
    private _addAsset;
    private _removeAsset;
    toJSON(): {
        assets: {
            uuid: string;
            name: string;
        }[];
    };
    fromJSON(json: IJSONObject): this;
}
