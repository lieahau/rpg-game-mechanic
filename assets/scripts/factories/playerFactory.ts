import { Node, Prefab, instantiate } from 'cc';
import { Player } from '../components/characters/player';
import { IPlayerData } from '../models/types/interfaces';
import { DataLoader } from '../managers/dataLoader';
import { IEntityFactory } from '../types/interfaces';
import { FILENAME } from '../types/enums';

export class PlayerFactory implements IEntityFactory<Node> {
  private prefab: Prefab;

  private static _instance: PlayerFactory;

  public static get instance(): PlayerFactory {
    if (!this._instance) {
      this._instance = new PlayerFactory();
    }
    return this._instance;
  }

  async create(data: IPlayerData): Promise<Node> {
    try {
      if (!this.prefab) {
        this.prefab = await DataLoader.instance.loadPrefab(FILENAME.PREFAB_PLAYER);
      }

      const playerNode = instantiate(this.prefab);
      const player = playerNode.getComponent(Player);
      if (!player) playerNode.addComponent(Player);

      player?.init(data);

      return playerNode;
    } catch (error) {
      throw new Error(error);
    }
  }
}
