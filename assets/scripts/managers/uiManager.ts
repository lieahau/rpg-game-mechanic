import { _decorator, Component, director, Node } from 'cc';
import { PlayerStatsHUD } from '../components/ui/playerStatsHUD';
import { Player } from '../components/characters/player';
import { GlobalGameEvents } from '../types/gameEvents';
import { SpellButton } from '../components/ui/spellButton';
import { DamageButton } from '../components/ui/damageButton';
import { EquipmentSlotsUI } from '../components/ui/equipmentSlotsUI';
import { InventoryUI } from '../components/ui/inventoryUI';
import { ItemDetailsUI } from '../components/ui/itemDetailsUI';
import { Item } from '../models/item';
import { ItemDetailsType } from '../types/enums';
import { Equipment } from '../models/equipment';
import { Consumable } from '../models/consumable';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
  @property(PlayerStatsHUD)
  private playerStatsHUD?: PlayerStatsHUD;

  @property(EquipmentSlotsUI)
  private equipmentSlotsUI?: EquipmentSlotsUI;

  @property(InventoryUI)
  private inventoryUI?: InventoryUI;

  @property(ItemDetailsUI)
  private itemDetailsUI?: ItemDetailsUI;

  @property(DamageButton)
  private damageButton?: DamageButton;

  @property(SpellButton)
  private spellButton?: SpellButton;

  private player?: Player;

  onLoad() {
    director.on(GlobalGameEvents.PLAYER_READY, this.onPlayerReady, this);
    director.on(GlobalGameEvents.ITEM_CLICK, this.onShowItemDetails, this);
  }

  onDestroy() {
    director.off(GlobalGameEvents.PLAYER_READY, this.onPlayerReady, this);
    director.off(GlobalGameEvents.ITEM_CLICK, this.onShowItemDetails, this);
  }

  private async onPlayerReady(player: Node) {
    this.player = player.getComponent(Player);

    this.inventoryUI?.init(this.player.getInventorySystem(), this.player.getEquippedEquipments());

    const playerEventTarget = this.player?.getEventTarget();
    if (playerEventTarget) {
      this.playerStatsHUD?.setPlayerEventTarget(playerEventTarget);
      this.equipmentSlotsUI?.setPlayerEventTarget(playerEventTarget);
      this.inventoryUI?.setPlayerEventTarget(playerEventTarget);
      this.itemDetailsUI?.setPlayerEventTarget(playerEventTarget);
      this.damageButton?.setPlayerEventTarget(playerEventTarget);
      this.spellButton?.setPlayerEventTarget(playerEventTarget);
    }
  }

  private onShowItemDetails(item: Item, itemDetails: string) {
    if (!this.player) return;

    if (item instanceof Equipment) {
      const equippedEquipments = Array.from(this.player.getEquippedEquipments()).map(
        ([_, eq]) => eq
      );

      const isEquipped = equippedEquipments.some((eq) => item.isSame(eq));

      if (isEquipped) {
        this.itemDetailsUI.show(ItemDetailsType.CAN_UNEQUIP, item, itemDetails);
      } else {
        this.itemDetailsUI.show(ItemDetailsType.CAN_EQUIP, item, itemDetails);
      }
    } else if (item instanceof Consumable) {
      // TODO show consumable details
    }
  }
}
