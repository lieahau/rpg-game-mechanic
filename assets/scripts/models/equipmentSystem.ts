import { Equipment } from './equipment';
import { EquipmentType } from './types/enums';

export interface IEquipChange {
  previous: Equipment | null;
  new: Equipment | null;
}

export class EquipmentSystem {
  private slots: Map<EquipmentType, Equipment | null> = new Map();

  constructor() {
    Object.values(EquipmentType).map((type) => {
      this.slots.set(type, null);
    });
  }

  equip(item: Equipment): IEquipChange {
    if (!this.slots.has(item.slot)) return { previous: null, new: null };

    const previous = this.slots.get(item.slot);

    if (previous?.id === item.id) return { previous: null, new: null };

    this.slots.set(item.slot, item);

    return { previous, new: item };
  }

  unequip(slot: EquipmentType) {
    const previous = this.slots.get(slot);
    this.slots.set(slot, null);
    return previous;
  }

  getEquipped(slot: EquipmentType): Equipment | null {
    return this.slots.get(slot);
  }

  getAllEquipped(): Map<EquipmentType, Equipment | null> {
    return this.slots;
  }
}
