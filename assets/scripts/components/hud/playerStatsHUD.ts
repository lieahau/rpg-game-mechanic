import { _decorator, Component, director, Label } from 'cc';
import { GameEvents } from '../../types/gameEvents';
import { IStats } from '../../models/types/interfaces';
const { ccclass, property } = _decorator;

@ccclass('PlayerStatsHUD')
export class PlayerStatsHUD extends Component {
  @property(Label)
  private healthLabel?: Label;

  @property(Label)
  private manaLabel?: Label;

  @property(Label)
  private strengthLabel?: Label;

  @property(Label)
  private agilityLabel?: Label;

  @property(Label)
  private intelligenceLabel?: Label;

  onLoad() {
    director.on(GameEvents.PLAYER_STATS_CHANGED, this.updateHUD, this);
  }

  onDestroy() {
    director.off(GameEvents.PLAYER_STATS_CHANGED, this.updateHUD, this);
  }

  private updateHUD(stats: IStats) {
    if (this.healthLabel) {
      this.healthLabel.string = `${stats.health} / ${stats.maxHealth}`;
    }

    if (this.manaLabel) {
      this.manaLabel.string = `${stats.mana} / ${stats.maxMana}`;
    }

    if (this.strengthLabel) {
      this.strengthLabel.string = `${stats.strength}`;
    }

    if (this.agilityLabel) {
      this.agilityLabel.string = `${stats.agility}`;
    }

    if (this.intelligenceLabel) {
      this.intelligenceLabel.string = `${stats.intelligence}`;
    }
  }
}
