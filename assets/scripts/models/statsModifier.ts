import { IStatsModifier, IStats } from './types/interfaces';

export class StatsModifier implements IStatsModifier {
  private stats: Partial<IStats>;

  constructor(stats: Partial<IStats>) {
    this.stats = stats;
  }

  apply(stats: IStats): IStats {
    return {
      ...stats,
      strength: stats.strength + (this.stats.strength ?? 0),
      agility: stats.agility + (this.stats.agility ?? 0),
      intelligence: stats.intelligence + (this.stats.intelligence ?? 0),
      maxHealth: stats.maxHealth + (this.stats.maxHealth ?? 0),
      maxMana: stats.maxMana + (this.stats.maxMana ?? 0),
      health: Math.min(stats.health, stats.maxHealth + (this.stats.maxHealth ?? 0)),
      mana: Math.min(stats.mana, stats.maxMana + (this.stats.maxMana ?? 0)),
    };
  }
}
