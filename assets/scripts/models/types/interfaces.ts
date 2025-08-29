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

export type IEquipmentSlots = {
  [key in EquipmentType]?: IEquipment;
};

export interface IPlayerData {
  stats: Partial<IStats>;
  equipments: IEquipmentSlots;
}
