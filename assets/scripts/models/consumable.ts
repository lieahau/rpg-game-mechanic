import { Item } from './item';
import { IConsumable, IConsumableItem } from './types/interfaces';

export class Consumable extends Item implements IConsumableItem {
  quantity: number;
  readonly item: IConsumable;

  constructor(data: IConsumableItem) {
    super();
    this.item = data.item;
    this.quantity = data.quantity;
  }

  getQuantity(): number {
    return this.quantity;
  }

  addQuantity(amount: number, maxStack: number): number {
    const total = this.quantity + amount;
    const overflow = total > maxStack ? total - maxStack : 0;
    this.quantity = Math.min(total, maxStack);
    return overflow;
  }

  removeQuantity(amount: number): number {
    const removed = Math.min(this.quantity, amount);
    this.quantity -= removed;
    return removed;
  }

  isSame(comparisonConsumable?: Consumable): boolean {
    return this.item.id === comparisonConsumable?.item.id;
  }
}
