import { Option, iter } from "@aicacia/core";
import { Plugin } from "../../sceneGraph";

export class Assets extends Plugin {
  private assets: Asset[] = [];
  private loadedAssets: Asset[] = [];
  private loadingPromises: Map<Asset, Promise<void>> = new Map();
  private unloadingPromises: Map<Asset, Promise<void>> = new Map();

  find(fn: (asset: Asset) => boolean): Option<Asset> {
    return iter(this.assets).find(fn);
  }
  findWithName(name: string) {
    return this.find((asset) => asset.getName() === name);
  }

  findAll(fn: (asset: Asset) => boolean): Asset[] {
    return iter(this.assets).filter(fn).toArray();
  }
  findAllWithName(name: string) {
    return this.findAll((asset) => asset.getName() === name);
  }

  isLoading() {
    return this.loadingPromises.size > 0;
  }

  getAssets(): readonly Asset[] {
    return this.assets;
  }

  getLoadedAssets(): readonly Asset[] {
    return this.loadedAssets;
  }
  getLoadingAssets() {
    return Array.from(this.loadingPromises.keys());
  }

  getUnloadingAssets() {
    return Array.from(this.unloadingPromises.keys());
  }
  getUnloadedAssets(): ReadonlyArray<Asset> {
    return this.assets.filter((asset) => !asset.isLoaded());
  }

  addAsset(...assets: readonly Asset[]) {
    return this.addAssets(assets);
  }
  addAssets(assets: readonly Asset[]) {
    assets.forEach((asset) => this._addAsset(asset));
    return this;
  }

  removeAsset(...assets: readonly Asset[]) {
    return this.removeAssets(assets);
  }
  removeAssets(assets: readonly Asset[]) {
    assets.forEach((asset) => this._removeAsset(asset));
    return this;
  }

  loadAll() {
    return this.loadAssets(this.getUnloadedAssets());
  }
  loadAllInBackground() {
    return this.loadAssetsInBackground(this.getUnloadedAssets());
  }

  loadAssetInBackground(...assets: readonly Asset[]) {
    return this.loadAssetsInBackground(assets);
  }
  loadAssetsInBackground(assets: readonly Asset[]) {
    this.loadAssets(assets);
    return this;
  }

  unloadAssetInBackground(...assets: readonly Asset[]) {
    return this.unloadAssetsInBackground(assets);
  }
  unloadAssetsInBackground(assets: readonly Asset[]) {
    this.unloadAssets(assets);
    return this;
  }

  loadAsset(...assets: readonly Asset[]) {
    return this.loadAssets(assets);
  }
  loadAssets(assets: readonly Asset[]) {
    return Promise.all(assets.map((asset) => this._loadAsset(asset)));
  }

  unloadAsset(...assets: readonly Asset[]) {
    return this.unloadAssets(assets);
  }
  unloadAssets(assets: readonly Asset[]) {
    return Promise.all(assets.map((asset) => this._unloadAsset(asset)));
  }

  private _loadAsset(asset: Asset): Promise<void> {
    if (asset.isLoaded()) {
      return Promise.resolve();
    } else {
      const promise = this.loadingPromises.get(asset);

      if (promise) {
        return promise;
      } else {
        const promise = asset
          .load()
          .then(() => {
            this.loadingPromises.delete(asset);
            this.loadedAssets.push(asset);
          })
          .catch((error) => {
            this.loadingPromises.delete(asset);
            throw error;
          });

        this.loadingPromises.set(asset, promise);

        return promise;
      }
    }
  }

  private _unloadAsset(asset: Asset): Promise<void> {
    if (!asset.isLoaded()) {
      return Promise.resolve();
    } else {
      const promise = this.unloadingPromises.get(asset);

      if (promise) {
        return promise;
      } else {
        const promise = asset
          .load()
          .then(() => {
            this.unloadingPromises.delete(asset);
            this.loadedAssets.splice(this.loadedAssets.indexOf(asset), 1);
          })
          .catch((error) => {
            this.unloadingPromises.delete(asset);
            throw error;
          });

        this.unloadingPromises.set(asset, promise);

        return promise;
      }
    }
  }

  private _addAsset(asset: Asset) {
    if (this.assets.indexOf(asset) === -1) {
      this.assets.push(asset);
    }
    return this;
  }

  private _removeAsset(asset: Asset) {
    const index = this.assets.indexOf(asset);
    if (index !== -1) {
      this.assets.splice(index, 1);
    }
    return this;
  }
}

import { Asset } from "./Asset";
