import { _decorator, Component, director } from 'cc';
import { GameEvents } from '../../types/gameEvents';
import { IPlayerData } from '../../models/types/interfaces';
import { PlayerController } from '../../controllers/playerController';
import { Equipment } from '../../models/equipment';
import { EquipmentType } from '../../models/types/enums';

const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {
  private controller: PlayerController;

  onLoad() {
    director.on(GameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    director.on(GameEvents.PLAYER_HEAL, this.heal, this);
    director.on(GameEvents.PLAYER_USE_MANA, this.useMana, this);
    director.on(GameEvents.PLAYER_RESTORE_MANA, this.restoreMana, this);
  }

  onDestroy() {
    director.off(GameEvents.PLAYER_TAKE_DAMAGE, this.takeDamage, this);
    director.off(GameEvents.PLAYER_HEAL, this.heal, this);
    director.off(GameEvents.PLAYER_USE_MANA, this.useMana, this);
    director.off(GameEvents.PLAYER_RESTORE_MANA, this.restoreMana, this);
  }

  init(data: IPlayerData) {
    this.controller = new PlayerController(data);

    this.notifyEquipmentChanged();
    this.notifyStatsChanged();
  }

  getStats() {
    return this.controller.getStats();
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
    director.emit(GameEvents.PLAYER_STATS_CHANGED, this.controller.getStats());
  }

  private notifyEquipmentChanged(...args: Equipment[]) {
    director.emit(GameEvents.PLAYER_EQUIPMENT_CHANGED, this.controller.getAllEquipped(), ...args);
  }
}
