import { EquipmentModelFactory } from '../factories/equipmentModelFactory';
import { IInventory, IInventoryItem, IsInventoryIEquipmentItem } from './types/interfaces';

export class InventorySystem implements IInventory {
  readonly items: IInventoryItem[];
  readonly maxSlots: number;

  private filledSlots: number;

  constructor(data: IInventory) {
    this.maxSlots = data.maxSlots;

    const equipmentItems = data.items.filter((item) => IsInventoryIEquipmentItem(item));
    const equipments = EquipmentModelFactory.instance.createBulk(equipmentItems);
    this.items = [...equipments];

    this.filledSlots = this.items.length;
  }

  getItems(): Array<IInventoryItem> {
    return this.items;
  }

  getMaxSlots(): number {
    return this.maxSlots;
  }

  hasSpace(requiredSlots: number = 1): boolean {
    return this.filledSlots + requiredSlots <= this.maxSlots;
  }

  addItem(item: IInventoryItem): boolean {
    if (!this.hasSpace()) return false;

    this.items.push(item);
    return true;
  }

  removeItem(item: IInventoryItem): IInventoryItem | null {
    const index = this.items.findIndex((it) => it === item);
    if (index === -1) return null;

    const [removed] = this.items.splice(index, 1);
    return removed;
  }
}
