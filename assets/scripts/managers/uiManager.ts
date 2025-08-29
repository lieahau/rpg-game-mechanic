import { _decorator, Component, director, Node } from 'cc';
import { PlayerStatsHUD } from '../components/ui/playerStatsHUD';
import { Player } from '../components/characters/player';
import { GlobalGameEvents } from '../types/gameEvents';
import { SpellButton } from '../components/ui/spellButton';
import { DamageButton } from '../components/ui/damageButton';
const { ccclass, property } = _decorator;

@ccclass('UIManagers')
export class UIManagers extends Component {
  @property(PlayerStatsHUD)
  private playerStatsHUD?: PlayerStatsHUD;

  @property(DamageButton)
  private damageButton?: DamageButton;

  @property(SpellButton)
  private spellButton?: SpellButton;

  onEnable() {
    director.on(GlobalGameEvents.PLAYER_READY, this.onPlayerReady, this);
  }

  onDisable() {
    director.off(GlobalGameEvents.PLAYER_READY, this.onPlayerReady, this);
  }

  private onPlayerReady(player: Node) {
    const playerEventTarget = player.getComponent(Player)?.getEventTarget();
    if (playerEventTarget) {
      this.playerStatsHUD?.setPlayerEventTarget(playerEventTarget);
      this.damageButton?.setPlayerEventTarget(playerEventTarget);
      this.spellButton?.setPlayerEventTarget(playerEventTarget);
    }
  }
}
