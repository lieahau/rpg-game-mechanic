import { _decorator, CCInteger, Component, EventTarget } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
const { ccclass, property } = _decorator;

@ccclass('DamageButton')
export class DamageButton extends Component {
  @property(CCInteger)
  private damageAmount = 1;

  private playerEventTarget?: EventTarget;

  setPlayerEventTarget(eventTarget: EventTarget) {
    this.playerEventTarget = eventTarget;
  }

  onClick() {
    this.playerEventTarget?.emit(PlayerGameEvents.PLAYER_TAKE_DAMAGE, this.damageAmount);
  }
}
