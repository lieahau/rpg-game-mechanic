import { BaseStats } from './baseStats';
import { IStats } from './types/interfaces';

export class PlayerStats {
  private baseStats: BaseStats;
  private modifiers: Partial<IStats>[] = [];

  constructor(initialStats: Partial<IStats>) {
    this.baseStats = new BaseStats(initialStats);
  }

  addModifier(modifier: Partial<IStats>) {
    this.modifiers.push(modifier);
  }

  removeModifier(modifier: Partial<IStats>) {
    this.modifiers = this.modifiers.filter((m) => m !== modifier);
  }

  getStats(): IStats {
    // base stats + all modifiers applied
    return this.modifiers.reduce((accumulator: IStats, modifier) => {
      Object.keys(modifier).forEach((key) => {
        if (key === 'health') {
          accumulator[key] = Math.min(accumulator[key] + modifier[key], accumulator.maxHealth);
        } else if (key === 'mana') {
          accumulator[key] = Math.min(accumulator[key] + modifier[key], accumulator.maxMana);
        } else if (key in accumulator) {
          accumulator[key] += modifier[key];
        }
      });
      return accumulator;
    }, this.baseStats.clone()) as IStats;
  }

  isFullHealth() {
    return this.baseStats.health >= this.baseStats.maxHealth;
  }

  takeDamage(amount: number) {
    if (amount <= 0) return false;

    this.baseStats.health = Math.max(this.baseStats.health - amount, 0);
    return true;
  }

  heal(amount: number) {
    if (amount <= 0 || this.isFullHealth()) return false;

    this.baseStats.health = Math.min(this.baseStats.health + amount, this.baseStats.maxHealth);
    return true;
  }

  isFullMana() {
    return this.baseStats.mana >= this.baseStats.maxMana;
  }

  useMana(amount: number) {
    if (amount <= 0) return false;

    this.baseStats.mana = Math.max(this.baseStats.mana - amount, 0);
    return true;
  }

  restoreMana(amount: number) {
    if (amount <= 0 || this.isFullMana()) return false;

    this.baseStats.mana = Math.min(this.baseStats.mana + amount, this.baseStats.maxMana);
    return true;
  }
}
