import { _decorator, Color, Component, EventTarget, Sprite, tween } from 'cc';
import { IPlayerData, IStats } from '../../models/types/interfaces';
import { PlayerController } from '../../controllers/playerController';
import { Equipment } from '../../models/equipment';
import { ConsumableType, EquipmentType } from '../../models/types/enums';
import { PlayerGameEvents } from '../../types/gameEvents';
import { InventorySystem } from '../../models/inventorySystem';
import { Consumable } from '../../models/consumable';
const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
  private sprite: Sprite;

  private controller: PlayerController;
  private eventTarget: EventTarget = new EventTarget(); // A simple, built-in Observer Pattern

  onLoad() {
    this.sprite = this.getComponent(Sprite);

    this.eventTarget.on(PlayerGameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_USE_MANA, this.useMana, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_EQUIPPING_EQUIPMENT, this.equip, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_UNEQUIPPING_EQUIPMENT, this.unequip, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_USING_CONSUMABLE, this.useConsumable, this);
  }

  onDestroy() {
    this.eventTarget.off(PlayerGameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_USE_MANA, this.useMana, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_EQUIPPING_EQUIPMENT, this.equip, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_UNEQUIPPING_EQUIPMENT, this.unequip, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_USING_CONSUMABLE, this.useConsumable, this);
  }

  init(data: IPlayerData) {
    this.controller = new PlayerController(data);
  }

  start() {
    this.notifyStatsChanged();
    this.notifyEquipmentChanged();
  }

  getEventTarget(): EventTarget {
    return this.eventTarget;
  }

  getStats(): IStats {
    return this.controller.getStats();
  }

  getEquippedEquipments(): Map<EquipmentType, Equipment> {
    return this.controller.getAllEquipped();
  }

  getInventorySystem(): InventorySystem {
    return this.controller.getInventorySystem();
  }

  takeDamage(amount: number) {
    const succeed = this.controller.takeDamage(amount);
    if (succeed) {
      this.notifyStatsChanged();
      this.playVFX(Color.RED);
    }
    return succeed;
  }

  useMana(amount: number) {
    const succeed = this.controller.useMana(amount);
    if (succeed) {
      this.notifyStatsChanged();
      this.playVFX(Color.BLUE);
    }
    return succeed;
  }

  equip(equipment: Equipment) {
    const equipChanged = this.controller.equip(equipment);
    if (equipChanged.new) {
      this.notifyEquipmentChanged(equipChanged.previous, equipChanged.new);
      this.notifyStatsChanged();
    }
  }

  unequip(slot: EquipmentType) {
    const previousEquipment = this.controller.unequip(slot);
    if (previousEquipment) {
      this.notifyEquipmentChanged(previousEquipment);
      this.notifyStatsChanged();
    }
  }

  useConsumable(item: Consumable) {
    const succeed = this.controller.useConsumable(item);

    if (succeed) {
      this.notifyStatsChanged();
      this.notifyConsumableUsed(item);

      if (item.item.type === ConsumableType.HP_POTION) this.playVFX(Color.GREEN);
      if (item.item.type === ConsumableType.MP_POTION) this.playVFX(Color.CYAN);
    }
  }

  private notifyStatsChanged() {
    this.eventTarget.emit(PlayerGameEvents.PLAYER_STATS_CHANGED, this.controller.getStats());
  }

  private notifyEquipmentChanged(...args: Equipment[]) {
    this.eventTarget.emit(
      PlayerGameEvents.PLAYER_EQUIPMENT_CHANGED,
      this.controller.getAllEquipped(),
      ...args
    );
  }

  private notifyConsumableUsed(item: Consumable) {
    this.eventTarget.emit(PlayerGameEvents.PLAYER_CONSUMABLE_USED, item);
  }

  private playVFX(color: Color) {
    if (!this.sprite) return;

    tween(this.sprite)
      .to(0.1, { color: color }, { easing: 'fade' })
      .to(0.1, { color: Color.WHITE }, { easing: 'fade' })
      .start();
  }
}
