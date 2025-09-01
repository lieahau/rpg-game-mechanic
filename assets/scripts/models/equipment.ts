import { Item } from './item';
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

  isSame(comparisonEquipment?: Equipment): boolean {
    return (
      this.instanceId === comparisonEquipment?.instanceId &&
      this.item.id === comparisonEquipment?.item.id
    );
  }
}
