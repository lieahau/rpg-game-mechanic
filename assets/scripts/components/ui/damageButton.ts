import { _decorator, CCInteger, Component, director } from 'cc';
import { GameEvents } from '../../types/gameEvents';
const { ccclass, property } = _decorator;

@ccclass('DamageButton')
export class DamageButton extends Component {
  @property(CCInteger)
  private damageAmount = 1;

  onClick() {
    director.emit(GameEvents.PLAYER_TAKE_DAMAGE, this.damageAmount);
  }
}
