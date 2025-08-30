import { Item } from './item';
import { ItemType } from './types/enums';
import { IEquipment, IEquipmentItem } from './types/interfaces';

export class Equipment extends Item implements IEquipmentItem {
  readonly instanceId: number;
  readonly item: IEquipment;

  constructor(data: IEquipmentItem) {
    super();
    this.instanceId = data.instanceId;
    this.item = data.item;
  }

  getType(): ItemType {
    return ItemType.EQUIPMENT;
  }
}
