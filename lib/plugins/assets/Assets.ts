import { err, ok } from "@aicacia/core";
import { Plugin } from "../../sceneGraph";

export class Assets extends Plugin {
  static pluginName = "engine.Assets";

  private assets: Asset[] = [];
  private loadedAssets: Asset[] = [];
  private loadingPromises: Map<Asset, Promise<void>> = new Map();
  private unloadingPromises: Map<Asset, Promise<void>> = new Map();

  isLoading() {
    return this.loadingPromises.size > 0;
  }

  getAssets() {
    return this.assets;
  }
  getLoadingAssets() {
    return Array.from(this.loadingPromises.keys());
  }
  getUnloadingAssets() {
    return Array.from(this.unloadingPromises.keys());
  }

  addAsset(...assets: Asset[]) {
    return this.addAssets(assets);
  }
  addAssets(assets: Asset[]) {
    assets.forEach(asset => this._addAsset(asset));
    return this;
  }

  removeAsset(...assets: Asset[]) {
    return this.removeAssets(assets);
  }
  removeAssets(assets: Asset[]) {
    assets.forEach(asset => this._removeAsset(asset));
    return this;
  }

  loadAssetInBackground(...assets: Asset[]) {
    return this.loadAssetsInBackground(assets);
  }
  loadAssetsInBackground(assets: Asset[]) {
    this.loadAssets(assets);
    return this;
  }

  unloadAssetInBackground(...assets: Asset[]) {
    return this.unloadAssetsInBackground(assets);
  }
  unloadAssetsInBackground(assets: Asset[]) {
    this.unloadAssets(assets);
    return this;
  }

  loadAsset(...assets: Asset[]) {
    return this.loadAssets(assets);
  }
  loadAssets(assets: Asset[]) {
    return Promise.all(
      assets.map(asset => this._loadAsset(asset))
    ).then(() => {});
  }

  unloadAsset(...assets: Asset[]) {
    return this.unloadAssets(assets);
  }
  unloadAssets(assets: Asset[]) {
    return Promise.all(
      assets.map(asset => this._unloadAsset(asset))
    ).then(() => {});
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
          .catch(error => {
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
          .catch(error => {
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
