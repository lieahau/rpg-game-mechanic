import { ConsumableModelFactory } from '../factories/consumableModelFactory';
import { EquipmentModelFactory } from '../factories/equipmentModelFactory';
import { Consumable } from './consumable';
import { Item } from './item';
import { IInventory } from './types/interfaces';

export class InventorySystem {
  private items: Item[];
  private maxSlots: number;

  private readonly MAX_STACK_SIZE = 99;

  constructor(data: IInventory) {
    this.maxSlots = data.maxSlots;

    // convert IEquipmentItem to Equipment models
    const equipmentItems = data.items.filter((item) => 'instanceId' in item);
    const equipments = EquipmentModelFactory.instance.createBulk(equipmentItems);

    // convert IConsumableItem to Consumable models
    const consumableItems = data.items.filter((item) => 'quantity' in item);
    const consumables = ConsumableModelFactory.instance.createBulk(consumableItems);

    this.items = [...equipments, ...consumables];
  }

  getItems(): Array<Item> {
    return this.items;
  }

  getConsumableItem(id: number): Consumable[] {
    return this.items.filter((it) => it instanceof Consumable && it.item.id === id) as Consumable[];
  }

  getMaxSlots(): number {
    return this.maxSlots;
  }

  getFilledSlotsAmount(): number {
    return this.items.length;
  }

  getAvailableSlots(): number {
    return this.maxSlots - this.items.length;
  }

  hasSpace(requiredSlots: number = 1): boolean {
    return this.items.length + requiredSlots <= this.maxSlots;
  }

  addItem(item: Item): boolean {
    if (item instanceof Consumable) {
      return this.addConsumableItem(item);
    } else {
      // need space for new slot
      if (!this.hasSpace()) return false;

      this.items.push(item);
      return true;
    }
  }

  removeItem(item: Item): Item | null {
    const index = this.items.findIndex((it) => it === item);
    if (index === -1) return null;

    const [removed] = this.items.splice(index, 1);
    return removed;
  }

  private addConsumableItem(item: Consumable): boolean {
    let remaining = item.getQuantity();
    let isSuccess = false;

    // merge into existing non-full stacks
    const owned = this.getConsumableItem(item.item.id);
    for (const stack of owned) {
      if (remaining <= 0) break;

      const free = this.MAX_STACK_SIZE - stack.getQuantity();
      if (free > 0) {
        const take = Math.min(remaining, free);
        stack.addQuantity(take, this.MAX_STACK_SIZE);
        remaining -= take;
        isSuccess = true;
      }
    }

    if (remaining <= 0) return isSuccess;

    // create as many new stacks as possible
    let freeSlots = this.getAvailableSlots();
    while (remaining > 0 && freeSlots > 0) {
      const toStack = Math.min(remaining, this.MAX_STACK_SIZE);
      this.items.push(new Consumable({ item: item.item, quantity: toStack }));
      remaining -= toStack;
      freeSlots--;
      isSuccess = true;
    }

    // partial success if "remaining > 0", the remaining items won't be added to the inventory
    return isSuccess;
  }
}
