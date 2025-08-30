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
import { ItemType } from '../models/types/enums';
import { Equipment } from '../models/equipment';
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

    this.inventoryUI?.setMaxSlots(this.player.getInventoryMaxSlotsAmount());
    this.inventoryUI?.init(this.player.getInventoryItems(), this.player.getEquippedEquipments());

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

  private onShowItemDetails(selectedItem: Item, itemDetails: string) {
    if (!this.player) return;

    const itemType = selectedItem.getType();
    if (itemType === ItemType.EQUIPMENT) {
      const item = selectedItem as Equipment;

      const equippedEquipments = Array.from(this.player.getEquippedEquipments()).map(
        ([_, eq]) => eq
      );

      const isEquipped = equippedEquipments.some(
        (eq) => eq?.instanceId === item.instanceId && eq?.item.id === item.item.id
      );

      if (isEquipped) {
        this.itemDetailsUI.show(ItemDetailsType.CAN_UNEQUIP, selectedItem, itemDetails);
      } else {
        this.itemDetailsUI.show(ItemDetailsType.CAN_EQUIP, selectedItem, itemDetails);
      }
    }
  }
}
