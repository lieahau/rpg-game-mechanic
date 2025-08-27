import { _decorator, Component, director } from 'cc';
import { PlayerStats } from '../../models/playerStats';
import { GameEvents } from '../../types/gameEvents';

const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
  private stats: PlayerStats;

  onLoad() {
    this.stats = new PlayerStats({
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      strength: 10,
      agility: 5,
      intelligence: 8,
    });
  }

  start() {
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
