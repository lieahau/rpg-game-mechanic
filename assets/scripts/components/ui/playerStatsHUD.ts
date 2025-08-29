import { _decorator, Component, EventTarget, Label } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
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

  private playerEventTarget?: EventTarget;

  onDestroy() {
    this.setPlayerEventListenersOff();
  }

  setPlayerEventTarget(eventTarget: EventTarget) {
    this.setPlayerEventListenersOff();
    this.playerEventTarget = eventTarget;
    this.setPlayerEventListenersOn();
  }

  private setPlayerEventListenersOn() {
    this.playerEventTarget?.on(PlayerGameEvents.PLAYER_STATS_CHANGED, this.updateHUD, this);
  }

  private setPlayerEventListenersOff() {
    this.playerEventTarget?.off(PlayerGameEvents.PLAYER_STATS_CHANGED, this.updateHUD, this);
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
