import { EquipmentModelFactory } from '../factories/equipmentModelFactory';
import { Item } from './item';
import { IInventory, IsInventoryIEquipmentItem } from './types/interfaces';

export class InventorySystem {
  private items: Item[];
  private maxSlots: number;

  private filledSlots: number;

  constructor(data: IInventory) {
    this.maxSlots = data.maxSlots;

    // convert IEquipment to Equipment models
    const equipmentItems = data.items.filter((item) => IsInventoryIEquipmentItem(item));
    const equipments = EquipmentModelFactory.instance.createBulk(equipmentItems);

    this.items = [...equipments];

    this.filledSlots = this.items.length;
  }

  getItems(): Array<Item> {
    return this.items;
  }

  getMaxSlots(): number {
    return this.maxSlots;
  }

  getFilledSlots(): number {
    return this.filledSlots;
  }

  hasSpace(requiredSlots: number = 1): boolean {
    return this.filledSlots + requiredSlots <= this.maxSlots;
  }

  addItem(item: Item): boolean {
    if (!this.hasSpace()) return false;

    this.items.push(item);
    return true;
  }

  removeItem(item: Item): Item | null {
    const index = this.items.findIndex((it) => it === item);
    if (index === -1) return null;

    const [removed] = this.items.splice(index, 1);
    return removed;
  }
}
