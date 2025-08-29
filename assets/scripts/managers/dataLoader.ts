import { resources, JsonAsset, Prefab, assetManager, AssetManager, SpriteFrame } from 'cc';
import { BUNDLENAME } from '../types/enums';

export class DataLoader {
  private prefabBundle: AssetManager.Bundle;

  private prefabCache: Map<string, Prefab> = new Map();

  private spriteFrameCache: Map<string, SpriteFrame> = new Map();

  private static _instance: DataLoader;

  public static get instance(): DataLoader {
    if (!this._instance) {
      this._instance = new DataLoader();
    }
    return this._instance;
  }

  async loadJson<T>(fileName: string): Promise<T> {
    return new Promise((resolve, reject) => {
      resources.load(`data/${fileName}`, JsonAsset, (err, asset) => {
        if (err) {
          reject(err);
        } else {
          resolve(asset.json as T);
        }
      });
    });
  }

  async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
    return new Promise((resolve, reject) => {
      assetManager.loadBundle(bundleName, (err, bundle) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(bundle);
      });
    });
  }

  async loadPrefab(fileName: string): Promise<Prefab> {
    if (this.prefabCache.has(fileName)) {
      return this.prefabCache.get(fileName);
    }

    try {
      if (!this.prefabBundle) {
        this.prefabBundle = await this.loadBundle(BUNDLENAME.PREFABS);
      }
    } catch (error) {
      throw new Error(error);
    }

    return new Promise((resolve, reject) => {
      this.prefabBundle.load(fileName, Prefab, (err, prefab) => {
        if (err) {
          reject(err);
        } else {
          this.prefabCache.set(fileName, prefab);
          resolve(prefab);
        }
      });
    });
  }

  async loadSpriteFrame(path: string): Promise<SpriteFrame> {
    if (this.spriteFrameCache.has(path)) {
      return this.spriteFrameCache.get(path);
    }

    return new Promise<SpriteFrame>((resolve, reject) => {
      resources.load(`${path}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
        if (err || !spriteFrame) {
          reject(err);
          return;
        }

        this.spriteFrameCache.set(path, spriteFrame);
        resolve(spriteFrame);
      });
    });
  }
}
