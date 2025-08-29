import { EquipmentModelFactory } from '../factories/equipmentModelFactory';
import { Equipment } from '../models/equipment';
import { EquipmentSystem, IEquipChange } from '../models/equipmentSystem';
import { PlayerStats } from '../models/playerStats';
import { EquipmentType } from '../models/types/enums';
import { IPlayerData } from '../models/types/interfaces';

export class PlayerController {
  private stats: PlayerStats;
  private equipmentSystem: EquipmentSystem;

  constructor(data: IPlayerData) {
    this.stats = new PlayerStats(data.stats);
    this.equipmentSystem = new EquipmentSystem();

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
    if (equipChange.previous) this.stats.removeModifier(equipChange.previous.stats);
    if (equipChange.new) this.stats.addModifier(equipChange.new.stats);

    return equipChange;
  }

  unequip(slot: EquipmentType): Equipment {
    const previousEquipment = this.equipmentSystem.unequip(slot);
    if (previousEquipment) this.stats.removeModifier(previousEquipment.stats);

    return previousEquipment;
  }
}
