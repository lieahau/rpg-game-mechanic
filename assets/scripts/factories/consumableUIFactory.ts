import { instantiate, Node, Prefab } from 'cc';
import { IEntityFactory } from '../types/interfaces';
import { DataLoader } from '../managers/dataLoader';
import { FILENAME } from '../types/enums';
import { Consumable } from '../models/consumable';
import { ConsumableUI } from '../components/ui/consumableUI';

export class ConsumableUIFactory implements IEntityFactory<Node> {
  private prefab: Prefab;

  private static _instance: ConsumableUIFactory;

  public static get instance(): ConsumableUIFactory {
    if (!this._instance) {
      this._instance = new ConsumableUIFactory();
    }
    return this._instance;
  }

  async create(data: Consumable, root?: Node): Promise<Node> {
    try {
      if (!this.prefab) {
        this.prefab = await DataLoader.instance.loadPrefab(FILENAME.PREFAB_CONSUMABLE_UI);
      }
      const sf = await DataLoader.instance.loadSpriteFrame(data.item.iconUrl);

      const consumableUINode = instantiate(this.prefab);
      const consumableUI = consumableUINode.getComponent(ConsumableUI);
      if (!consumableUI) consumableUINode.addComponent(ConsumableUI);

      consumableUI.setData(data);
      consumableUI.setSpriteFrame(sf);

      root?.addChild(consumableUINode);

      return consumableUINode;
    } catch (error) {
      throw new Error(error);
    }
  }
}
