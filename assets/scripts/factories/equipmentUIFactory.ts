import { instantiate, Node, Prefab } from 'cc';
import { IEntityFactory } from '../types/interfaces';
import { Equipment } from '../models/equipment';
import { DataLoader } from '../managers/dataLoader';
import { FILENAME } from '../types/enums';
import { EquipmentUI } from '../components/ui/equipmentUI';

export class EquipmentUIFactory implements IEntityFactory<Node> {
  private prefab: Prefab;

  private static _instance: EquipmentUIFactory;

  public static get instance(): EquipmentUIFactory {
    if (!this._instance) {
      this._instance = new EquipmentUIFactory();
    }
    return this._instance;
  }

  async create(data: Equipment, root?: Node): Promise<Node> {
    try {
      if (!this.prefab) {
        this.prefab = await DataLoader.instance.loadPrefab(FILENAME.PREFAB_EQUIPMENT_UI);
      }
      const sf = await DataLoader.instance.loadSpriteFrame(data.item.iconUrl);

      const equipmentUINode = instantiate(this.prefab);
      const equipmentUI = equipmentUINode.getComponent(EquipmentUI);
      if (!equipmentUI) equipmentUINode.addComponent(EquipmentUI);

      equipmentUI.setData(data);
      equipmentUI.setSpriteFrame(sf);

      root?.addChild(equipmentUINode);

      return equipmentUINode;
    } catch (error) {
      throw new Error(error);
    }
  }
}
