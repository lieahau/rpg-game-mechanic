import { PlayerController } from '../assets/scripts/controllers/playerController';
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
});
