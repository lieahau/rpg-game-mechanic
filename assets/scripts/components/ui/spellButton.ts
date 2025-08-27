import { _decorator, CCInteger, Component, director } from 'cc';
import { GameEvents } from '../../types/gameEvents';
const { ccclass, property } = _decorator;

@ccclass('SpellButton')
export class SpellButton extends Component {
  @property(CCInteger)
  private manaAmount = 1;

  onClick() {
    director.emit(GameEvents.PLAYER_USE_MANA, this.manaAmount);
  }
}
