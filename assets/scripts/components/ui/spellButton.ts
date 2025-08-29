import { _decorator, CCInteger, Component, EventTarget } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
const { ccclass, property } = _decorator;

@ccclass('SpellButton')
export class SpellButton extends Component {
  @property(CCInteger)
  private manaAmount = 1;

  private playerEventTarget?: EventTarget;

  setPlayerEventTarget(eventTarget: EventTarget) {
    this.playerEventTarget = eventTarget;
  }

  onClick() {
    this.playerEventTarget?.emit(PlayerGameEvents.PLAYER_USE_MANA, this.manaAmount);
  }
}
