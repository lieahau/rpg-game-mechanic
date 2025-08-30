import { EquipmentType } from './enums';

export interface IPlayerData {
  stats: Partial<IStats>;
  equipments: IEquipmentSlots;
  inventory: IInventory;
}

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
  // instanceId is used to differentiate multiple same IEquipment "id", but have other fields with various value
  // (e.g., a player has two iron helmets, one has 100 durability and the other one has 20 durability)
  instanceId: number;

  item: IEquipment;
  durability: number;
  maxDurability: number;
}

export type IEquipmentSlots = {
  [key in EquipmentType]?: IEquipmentItem;
};

export interface IConsumableItem {
  quantity: number;
}

export interface IInventory {
  maxSlots: number;
  items: (IEquipment | IConsumableItem)[];
}

export function IsInventoryIEquipmentItem(item): item is IEquipmentItem {
  return !!((item as IEquipmentItem)?.instanceId && (item as IEquipmentItem)?.item);
}
