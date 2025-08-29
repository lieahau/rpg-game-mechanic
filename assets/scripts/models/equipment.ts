import { IEquipment, IEquipmentItem } from './types/interfaces';

export class Equipment implements IEquipmentItem {
  readonly instanceId: number;
  readonly item: IEquipment;
  isEquipped: boolean;

  constructor(data: IEquipmentItem) {
    this.instanceId = data.instanceId;
    this.item = data.item;
    this.isEquipped = data.isEquipped;
  }

  getIsEquipped() {
    return this.isEquipped;
  }

  setIsEquipped(value: boolean) {
    this.isEquipped = value;
  }
}
