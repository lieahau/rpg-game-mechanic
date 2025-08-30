import { Item } from './item';
import { ItemType } from './types/enums';
import { IEquipment, IEquipmentItem } from './types/interfaces';

export class Equipment extends Item implements IEquipmentItem {
  readonly instanceId: number;
  readonly item: IEquipment;
  readonly durability: number;
  readonly maxDurability: number;

  constructor(data: IEquipmentItem) {
    super();
    this.instanceId = data.instanceId;
    this.item = data.item;
    this.durability = data.durability;
    this.maxDurability = data.maxDurability;
  }

  getType(): ItemType {
    return ItemType.EQUIPMENT;
  }

  isSame(comparisonEquipment?: Equipment): boolean {
    return (
      this.instanceId === comparisonEquipment?.instanceId &&
      this.item.id === comparisonEquipment?.item.id
    );
  }
}
