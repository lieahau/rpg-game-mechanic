import { _decorator, Component, EventTarget } from 'cc';
import { IPlayerData, IStats } from '../../models/types/interfaces';
import { PlayerController } from '../../controllers/playerController';
import { Equipment } from '../../models/equipment';
import { EquipmentType } from '../../models/types/enums';
import { PlayerGameEvents } from '../../types/gameEvents';
import { InventorySystem } from '../../models/inventorySystem';

const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
  private controller: PlayerController;
  private eventTarget: EventTarget = new EventTarget(); // A simple, built-in Observer Pattern

  onLoad() {
    this.eventTarget.on(PlayerGameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_HEAL, this.heal, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_USE_MANA, this.useMana, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_RESTORE_MANA, this.restoreMana, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_EQUIPMENT_EQUIPPING, this.equip, this);
    this.eventTarget.on(PlayerGameEvents.PLAYER_EQUIPMENT_UNEQUIPPING, this.unequip, this);
  }

  onDestroy() {
    this.eventTarget.off(PlayerGameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_HEAL, this.heal, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_USE_MANA, this.useMana, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_RESTORE_MANA, this.restoreMana, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_EQUIPMENT_EQUIPPING, this.equip, this);
    this.eventTarget.off(PlayerGameEvents.PLAYER_EQUIPMENT_UNEQUIPPING, this.unequip, this);
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
    this.controller.takeDamage(amount);
    this.notifyStatsChanged();
  }

  heal(amount: number) {
    this.controller.heal(amount);
    this.notifyStatsChanged();
  }

  useMana(amount: number) {
    this.controller.useMana(amount);
    this.notifyStatsChanged();
  }

  restoreMana(amount: number) {
    this.controller.restoreMana(amount);
    this.notifyStatsChanged();
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
}
