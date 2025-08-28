import { _decorator, Component, director } from 'cc';
import { PlayerStats } from '../../models/playerStats';
import { GameEvents } from '../../types/gameEvents';
import { IStats } from '../../models/types/interfaces';

const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
  private stats: PlayerStats;

  onLoad() {
    director.on(GameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    director.on(GameEvents.PLAYER_HEAL, this.heal, this);
    director.on(GameEvents.PLAYER_USE_MANA, this.useMana, this);
    director.on(GameEvents.PLAYER_RESTORE_MANA, this.restoreMana, this);
  }

  onDestroy() {
    director.off(GameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    director.off(GameEvents.PLAYER_HEAL, this.heal, this);
    director.off(GameEvents.PLAYER_USE_MANA, this.useMana, this);
    director.off(GameEvents.PLAYER_RESTORE_MANA, this.restoreMana, this);
  }

  init(stats: IStats) {
    this.stats = new PlayerStats({
      health: stats.health,
      maxHealth: stats.maxHealth,
      mana: stats.mana,
      maxMana: stats.maxMana,
      strength: stats.strength,
      agility: stats.agility,
      intelligence: stats.intelligence,
    });

    this.notifyChange();
  }

  getStats() {
    return this.stats.getStats();
  }

  takeDamage(amount: number) {
    this.stats.takeDamage(amount);
    this.notifyChange();
  }

  heal(amount: number) {
    this.stats.heal(amount);
    this.notifyChange();
  }

  useMana(amount: number) {
    this.stats.useMana(amount);
    this.notifyChange();
  }

  restoreMana(amount: number) {
    this.stats.restoreMana(amount);
    this.notifyChange();
  }

  private notifyChange() {
    director.emit(GameEvents.PLAYER_STATS_CHANGED, this.stats.getStats());
  }
}
