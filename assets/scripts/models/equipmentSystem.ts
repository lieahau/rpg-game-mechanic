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

  isSameEquipment(equipmentA?: Equipment, equipmentB?: Equipment) {
    return (
      equipmentA?.instanceId === equipmentB?.instanceId &&
      equipmentA?.item.id === equipmentB?.item.id
    );
  }

  equip(equipment: Equipment): IEquipChange {
    const previous = this.slots.get(equipment.item.slot);

    if (this.isSameEquipment(previous, equipment)) return { previous: null, new: null };

    this.slots.set(equipment.item.slot, equipment);

    return { previous, new: equipment };
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
