import { instantiate, Node, Prefab } from 'cc';
import { IEntityFactory } from '../types/interfaces';
import { DataLoader } from '../managers/dataLoader';
import { FILENAME } from '../types/enums';
import { InventorySlotUI } from '../components/ui/inventorySlotUI';

export class InventorySlotsUIFactory implements IEntityFactory<InventorySlotUI> {
  private prefab: Prefab;

  private static _instance: InventorySlotsUIFactory;

  public static get instance(): InventorySlotsUIFactory {
    if (!this._instance) {
      this._instance = new InventorySlotsUIFactory();
    }
    return this._instance;
  }

  async create(root: Node): Promise<InventorySlotUI> {
    try {
      if (!this.prefab) {
        this.prefab = await DataLoader.instance.loadPrefab(FILENAME.PREFAB_INVENTORY_SLOT_UI);
      }

      const inventorySlotUINode = instantiate(this.prefab);

      const comp = inventorySlotUINode.getComponent(InventorySlotUI);

      root.addChild(inventorySlotUINode);

      return comp;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createBulk(amount: number, root: Node): Promise<InventorySlotUI[]> {
    try {
      const inventorySlotUIComps: InventorySlotUI[] = [];
      for (let i = 0; i < amount; i++) {
        const slotUI = await this.create(root);
        inventorySlotUIComps.push(slotUI);
      }

      return inventorySlotUIComps;
    } catch (error) {
      throw new Error(error);
    }
  }
}
