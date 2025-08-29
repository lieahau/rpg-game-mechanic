import { Equipment } from './equipment';
import { EquipmentType } from './types/enums';

export interface IEquipChangeSuccess {
  previous: Equipment | null;
  new: Equipment;
}

export interface IEquipChangeFail {
  previous: null;
  new: null;
}

export type IEquipChange = IEquipChangeSuccess | IEquipChangeFail;

export class EquipmentSystem {
  private slots: Map<EquipmentType, Equipment | null> = new Map();

  constructor() {
    Object.values(EquipmentType).map((type) => {
      this.slots.set(type, null);
    });
  }

  equip(item: Equipment): IEquipChange {
    const previous = this.slots.get(item.slot);

    if (previous === item) return { previous: null, new: null };

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
