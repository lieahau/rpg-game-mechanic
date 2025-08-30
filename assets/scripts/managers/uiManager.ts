import { _decorator, Component, director, Node } from 'cc';
import { PlayerStatsHUD } from '../components/ui/playerStatsHUD';
import { Player } from '../components/characters/player';
import { GlobalGameEvents } from '../types/gameEvents';
import { SpellButton } from '../components/ui/spellButton';
import { DamageButton } from '../components/ui/damageButton';
import { EquipmentSlotsUI } from '../components/ui/equipmentSlotsUI';
import { InventoryUI } from '../components/ui/inventoryUI';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
  @property(PlayerStatsHUD)
  private playerStatsHUD?: PlayerStatsHUD;

  @property(EquipmentSlotsUI)
  private equipmentSlotsUI?: EquipmentSlotsUI;

  @property(InventoryUI)
  private inventoryUI?: InventoryUI;

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

  private async onPlayerReady(player: Node) {
    const playerComp = player.getComponent(Player);

    this.inventoryUI?.setMaxSlots(playerComp.getInventoryMaxSlotsAmount());
    this.inventoryUI?.init(playerComp.getInventoryItems(), playerComp.getEquippedEquipments());

    const playerEventTarget = playerComp?.getEventTarget();
    if (playerEventTarget) {
      this.playerStatsHUD?.setPlayerEventTarget(playerEventTarget);
      this.equipmentSlotsUI?.setPlayerEventTarget(playerEventTarget);
      this.inventoryUI?.setPlayerEventTarget(playerEventTarget);
      this.damageButton?.setPlayerEventTarget(playerEventTarget);
      this.spellButton?.setPlayerEventTarget(playerEventTarget);
    }
  }
}
