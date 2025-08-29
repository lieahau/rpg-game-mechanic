import { EquipmentModelFactory } from '../factories/equipmentModelFactory';
import { Equipment } from '../models/equipment';
import { EquipmentSystem, IEquipChange } from '../models/equipmentSystem';
import { InventorySystem } from '../models/inventorySystem';
import { PlayerStats } from '../models/playerStats';
import { EquipmentType } from '../models/types/enums';
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

  takeDamage(amount: number) {
    this.stats.takeDamage(amount);
  }

  heal(amount: number) {
    this.stats.heal(amount);
  }

  useMana(amount: number) {
    this.stats.useMana(amount);
  }

  restoreMana(amount: number) {
    this.stats.restoreMana(amount);
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
