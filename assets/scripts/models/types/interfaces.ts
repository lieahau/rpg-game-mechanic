import { ConsumableType, EquipmentType } from './enums';

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

export interface IItem {
  id: number;
  name: string;
  desc: string;
  stats: Partial<IStats>;
  iconUrl: string;
}

export interface IEquipment extends IItem {
  slot: EquipmentType;
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

export interface IConsumable extends IItem {
  type: ConsumableType;
}

export interface IConsumableItem {
  quantity: number;
  item: IConsumable;
}

export interface IInventory {
  maxSlots: number;
  items: (IEquipmentItem | IConsumableItem)[];
}
