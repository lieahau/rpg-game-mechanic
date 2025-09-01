import { PlayerController } from '../assets/scripts/controllers/playerController';
import { Equipment } from '../assets/scripts/models/equipment';
import { EquipmentType } from '../assets/scripts/models/types/enums';
import { playerDataMock } from './mock/playerData.mock';

describe('PlayerController', () => {
  let playerCtrl: PlayerController;

  beforeEach(() => {
    playerCtrl = new PlayerController(playerDataMock);
  });

  test('should initialize with correct stats', () => {
    const stats = playerCtrl.getStats();
    expect(stats.health).toBe(150);
    expect(stats.mana).toBe(75);
  });

  describe('Health management', () => {
    test('takes damage and heals correctly', () => {
      playerCtrl.takeDamage(50);
      expect(playerCtrl.getStats().health).toBe(100);

      const healed = playerCtrl.heal(40);
      expect(healed).toBe(true);
      expect(playerCtrl.getStats().health).toBe(140);
    });

    test('healing should not exceed maxHealth', () => {
      playerCtrl.heal(1000);
      expect(playerCtrl.getStats().health).toBe(playerCtrl.getStats().maxHealth);
    });
  });

  describe('Mana management', () => {
    test('uses and restores mana correctly', () => {
      playerCtrl.useMana(50);
      expect(playerCtrl.getStats().mana).toBe(25);

      const restored = playerCtrl.restoreMana(40);
      expect(restored).toBe(true);
      expect(playerCtrl.getStats().mana).toBe(65);
    });

    test('restoring mana should not exceed maxMana', () => {
      playerCtrl.restoreMana(1000);
      expect(playerCtrl.getStats().mana).toBe(playerCtrl.getStats().maxMana);
    });
  });

  describe('Equipment management', () => {
    test('should initialize with equipped helmet from mock data', () => {
      const equippedHelmet = playerCtrl.getEquipped(EquipmentType.HELMET);
      expect(equippedHelmet).not.toBeNull();
      expect(equippedHelmet?.item.name).toBe('Iron Helmet');

      // Stats should already include helmet stats
      const stats = playerCtrl.getStats();
      const baseStats = playerCtrl.getBaseStats();
      expect(stats.strength).toBe(baseStats.strength + equippedHelmet.item.stats.strength);
    });

    test('should equip new armor and update stats', () => {
      const armor = playerCtrl
        .getInventoryItems()
        .find(
          (item) =>
            item instanceof Equipment &&
            item.item.slot === EquipmentType.ARMOR &&
            item.item.id === 3
        ) as Equipment;

      const prevStrength = playerCtrl.getStats().strength;
      const prevIntelligence = playerCtrl.getStats().intelligence;

      const result = playerCtrl.equip(armor);

      expect(result.new).toBe(armor);
      expect(playerCtrl.getEquipped(EquipmentType.ARMOR)).toBe(armor);

      // Stats should increase by armor stats
      const stats = playerCtrl.getStats();
      expect(stats.strength).toBe(prevStrength + armor.item.stats.strength);
      expect(stats.intelligence).toBe(prevIntelligence + armor.item.stats.intelligence);
    });

    test('should replace equipped helmet and update stats', () => {
      const newHelmet = playerCtrl
        .getInventoryItems()
        .find(
          (item) => item instanceof Equipment && item.item.name === 'Leather Helmet'
        ) as Equipment;

      const result = playerCtrl.equip(newHelmet);

      expect(result.previous?.item.name).toBe('Iron Helmet');
      expect(result.new).toBe(newHelmet);

      // Stats should drop old helmet stats and add new one
      const stats = playerCtrl.getStats();
      const baseStats = playerCtrl.getBaseStats();
      expect(stats.strength).toBe(baseStats.strength + newHelmet.item.stats.strength);
    });

    test('should unequip helmet and remove its stats', () => {
      const removed = playerCtrl.unequip(EquipmentType.HELMET);

      expect(removed?.item.name).toBe('Iron Helmet');
      expect(playerCtrl.getEquipped(EquipmentType.HELMET)).toBeNull();

      // Helmet stats removed
      const stats = playerCtrl.getStats();
      const baseStats = playerCtrl.getBaseStats();
      expect(stats.strength).toBe(baseStats.strength);
    });

    test('should not re-equip same equipment instance', () => {
      const helmet = playerCtrl.getEquipped(EquipmentType.HELMET);
      const result = playerCtrl.equip(helmet);

      expect(result.new).toBeNull();
      expect(result.previous).toBeNull();
      expect(playerCtrl.getEquipped(EquipmentType.HELMET)).toBe(helmet);
    });
  });
});
