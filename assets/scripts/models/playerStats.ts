import { BaseStats } from './baseStats';
import { IStatsModifier, IStats } from './types/interfaces';

export class PlayerStats {
  private baseStats: BaseStats;
  private modifiers: IStatsModifier[] = [];

  constructor(initialStats: Partial<IStats>) {
    this.baseStats = new BaseStats(initialStats);
  }

  addModifier(modifier: IStatsModifier) {
    this.modifiers.push(modifier);
  }

  removeModifier(modifier: IStatsModifier) {
    this.modifiers = this.modifiers.filter((m) => m !== modifier);
  }

  getStats(): IStats {
    // base stats + all modifiers applied
    return this.modifiers.reduce(
      (current, modifier) => modifier.apply(current),
      this.baseStats.clone()
    );
  }

  takeDamage(amount: number) {
    if (amount < 0) return;

    this.baseStats.health = Math.max(this.baseStats.health - amount, 0);
  }

  heal(amount: number) {
    if (amount < 0) return;

    this.baseStats.health = Math.min(this.baseStats.health + amount, this.baseStats.maxHealth);
  }

  useMana(amount: number) {
    if (amount < 0) return;

    this.baseStats.mana = Math.max(this.baseStats.mana - amount, 0);
  }

  restoreMana(amount: number) {
    if (amount < 0) return;

    this.baseStats.mana = Math.min(this.baseStats.mana + amount, this.baseStats.maxMana);
  }
}
