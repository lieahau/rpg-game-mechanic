import { resources, JsonAsset, Prefab, assetManager, AssetManager } from 'cc';
import { BUNDLENAME } from '../types/enums';

export class DataLoader {
  private prefabBundle: AssetManager.Bundle;

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
          resolve(prefab);
        }
      });
    });
  }
}
