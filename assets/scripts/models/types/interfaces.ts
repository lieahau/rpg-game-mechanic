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
  // instanceId is used to differentiate multiple same IEquipment "id"
  instanceId: number;

  item: IEquipment;
  durability: number;
  maxDurability: number;
}

export type IEquipmentSlots = {
  [key in EquipmentType]?: IEquipmentItem;
};

export interface IConsumable {
  id: number;
  name: string;
  desc: string;
  stats: Partial<IStats>;
  iconUrl: string;
}

export interface IConsumableItem {
  quantity: number;
  item: IConsumable;
}

export interface IInventory {
  maxSlots: number;
  items: (IEquipmentItem | IConsumableItem)[];
}
