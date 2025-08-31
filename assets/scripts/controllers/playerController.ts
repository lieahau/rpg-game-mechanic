import { EquipmentModelFactory } from '../factories/equipmentModelFactory';
import { Consumable } from '../models/consumable';
import { Equipment } from '../models/equipment';
import { EquipmentSystem, IEquipChange } from '../models/equipmentSystem';
import { InventorySystem } from '../models/inventorySystem';
import { PlayerStats } from '../models/playerStats';
import { ConsumableType, EquipmentType } from '../models/types/enums';
import { IPlayerData } from '../models/types/interfaces';

export class PlayerController {
  private stats: PlayerStats;
  private equipmentSystem: EquipmentSystem;
  private inventorySystem: InventorySystem;

  constructor(data: IPlayerData) {
    this.stats = new PlayerStats(data.stats);
    this.equipmentSystem = new EquipmentSystem();
    this.inventorySystem = new InventorySystem(data.inventory);

    // convert IEquipment (if exist) to Equipment models and equip them
    const equipments = EquipmentModelFactory.instance.createFromMap(data.equipments);
    equipments.forEach((equipment) => this.equip(equipment));
  }

  getStats() {
    return this.stats.getStats();
  }

  getEquipped(slot: EquipmentType) {
    return this.equipmentSystem.getEquipped(slot);
  }

  getAllEquipped() {
    return this.equipmentSystem.getAllEquipped();
  }

  getInventorySystem() {
    return this.inventorySystem;
  }

  getInventoryItems() {
    return this.inventorySystem.getItems();
  }

  getInventoryMaxSlotsAmount() {
    return this.inventorySystem.getMaxSlots();
  }

  takeDamage(amount: number) {
    return this.stats.takeDamage(amount);
  }

  heal(amount: number) {
    return this.stats.heal(amount);
  }

  useMana(amount: number) {
    return this.stats.useMana(amount);
  }

  restoreMana(amount: number) {
    return this.stats.restoreMana(amount);
  }

  useConsumable(item: Consumable) {
    let succeed = false;
    if (item.item.type === ConsumableType.HP_POTION && item.item.stats.health) {
      succeed = this.heal(item.item.stats.health);
    } else if (item.item.type === ConsumableType.MP_POTION && item.item.stats.mana) {
      succeed = this.restoreMana(item.item.stats.mana);
    }

    if (succeed) {
      this.inventorySystem.reduceConsumableQuantity(item);
    }

    return succeed;
  }

  equip(equipment: Equipment): IEquipChange {
    const equipChange = this.equipmentSystem.equip(equipment);
    if (equipChange.previous) this.stats.removeModifier(equipChange.previous.item.stats);
    if (equipChange.new) this.stats.addModifier(equipChange.new.item.stats);

    return equipChange;
  }

  unequip(slot: EquipmentType): Equipment {
    const previousEquipment = this.equipmentSystem.unequip(slot);
    if (previousEquipment) this.stats.removeModifier(previousEquipment.item.stats);

    return previousEquipment;
  }
}
