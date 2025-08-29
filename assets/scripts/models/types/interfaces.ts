import { EquipmentType } from './enums';

export interface IStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intelligence: number;
}

export interface IEquipment {
  id: number;
  name: string;
  desc: string;
  slot: EquipmentType;
  stats: Partial<IStats>;
  iconUrl: string;
}

export interface IEquipmentItem {
  // instanceId is used for having multiple same Equipment "id", but have other fields with different value
  // (e.g., a player has ten iron helmets, one is equipped and the rest is not)
  instanceId: number;

  item: IEquipment;

  isEquipped: boolean;
}

export type IEquipmentSlots = {
  [key in EquipmentType]?: IEquipmentItem;
};

export interface IConsumableItem {
  quantity: number;
}

export type IInventoryItem = IEquipmentItem | IConsumableItem;

export function IsInventoryIEquipmentItem(item: IInventoryItem): item is IEquipmentItem {
  return !!((item as IEquipmentItem)?.instanceId && (item as IEquipmentItem)?.item);
}

export interface IInventory {
  maxSlots: number;
  items: IInventoryItem[];
}

export interface IPlayerData {
  stats: Partial<IStats>;
  equipments: IEquipmentSlots;
  inventory: IInventory;
}
