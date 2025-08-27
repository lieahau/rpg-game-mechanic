import { IStats } from './types/interfaces';

export class BaseStats implements IStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  agility: number;
  intelligence: number;

  constructor(initial: Partial<IStats>) {
    this.health = initial.health ?? 1;
    this.maxHealth = initial.maxHealth ?? 1;
    this.mana = initial.mana ?? 0;
    this.maxMana = initial.maxMana ?? 0;
    this.strength = initial.strength ?? 0;
    this.agility = initial.agility ?? 0;
    this.intelligence = initial.intelligence ?? 0;
  }

  clone(): IStats {
    return { ...this };
  }
}
