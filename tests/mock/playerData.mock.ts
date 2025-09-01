import { ConsumableType, EquipmentType } from '../../assets/scripts/models/types/enums';
import { IPlayerData } from '../../assets/scripts/models/types/interfaces';

export const playerDataMock: IPlayerData = {
  stats: {
    health: 150,
    maxHealth: 150,
    mana: 75,
    maxMana: 75,
    strength: 10,
    agility: 7,
    intelligence: 5,
  },

  equipments: {
    helmet: {
      instanceId: 2,
      durability: 85,
      maxDurability: 100,
      item: {
        id: 1,
        name: 'Iron Helmet',
        desc: 'A sturdy iron helmet.',
        slot: EquipmentType.HELMET,
        stats: {
          strength: 7,
        },
        iconUrl: 'images/iron_helmet',
      },
    },
    armor: null,
    boots: null,
  },

  inventory: {
    maxSlots: 50,
    items: [
      {
        instanceId: 1,
        durability: 60,
        maxDurability: 100,
        item: {
          id: 1,
          name: 'Iron Helmet',
          desc: 'A sturdy iron helmet.',
          slot: EquipmentType.HELMET,
          stats: {
            strength: 7,
          },
          iconUrl: 'images/iron_helmet',
        },
      },
      {
        instanceId: 2,
        durability: 85,
        maxDurability: 100,
        item: {
          id: 1,
          name: 'Iron Helmet',
          desc: 'A sturdy iron helmet.',
          slot: EquipmentType.HELMET,
          stats: {
            strength: 7,
          },
          iconUrl: 'images/iron_helmet',
        },
      },
      {
        instanceId: 1,
        durability: 5,
        maxDurability: 50,
        item: {
          id: 2,
          name: 'Leather Helmet',
          desc: 'An ordinary leather helmet.',
          slot: EquipmentType.HELMET,
          stats: {
            strength: 2,
          },
          iconUrl: 'images/leather_helmet',
        },
      },
      {
        instanceId: 1,
        durability: 130,
        maxDurability: 150,
        item: {
          id: 3,
          name: 'Magic Iron Armor',
          desc: 'A magical iron armor.',
          slot: EquipmentType.ARMOR,
          stats: {
            strength: 15,
            intelligence: 8,
          },
          iconUrl: 'images/iron_armor',
        },
      },
      {
        instanceId: 2,
        durability: 100,
        maxDurability: 150,
        item: {
          id: 3,
          name: 'Magic Iron Armor',
          desc: 'A magical iron armor.',
          slot: EquipmentType.ARMOR,
          stats: {
            strength: 15,
            intelligence: 8,
          },
          iconUrl: 'images/iron_armor',
        },
      },
      {
        instanceId: 1,
        durability: 40,
        maxDurability: 50,
        item: {
          id: 4,
          name: 'Leather Armor',
          desc: 'An ordinary leather armor.',
          slot: EquipmentType.ARMOR,
          stats: {
            strength: 4,
          },
          iconUrl: 'images/leather_armor',
        },
      },
      {
        instanceId: 2,
        durability: 30,
        maxDurability: 50,
        item: {
          id: 4,
          name: 'Leather Armor',
          desc: 'An ordinary leather armor.',
          slot: EquipmentType.ARMOR,
          stats: {
            strength: 4,
          },
          iconUrl: 'images/leather_armor',
        },
      },
      {
        instanceId: 3,
        durability: 50,
        maxDurability: 50,
        item: {
          id: 4,
          name: 'Leather Armor',
          desc: 'An ordinary leather armor.',
          slot: EquipmentType.ARMOR,
          stats: {
            strength: 4,
          },
          iconUrl: 'images/leather_armor',
        },
      },
      {
        instanceId: 1,
        durability: 7,
        maxDurability: 50,
        item: {
          id: 5,
          name: 'Leather Boots',
          desc: 'An ordinary leather boots.',
          slot: EquipmentType.BOOTS,
          stats: {
            agility: 10,
          },
          iconUrl: 'images/leather_boots',
        },
      },
      {
        instanceId: 2,
        durability: 20,
        maxDurability: 50,
        item: {
          id: 5,
          name: 'Leather Boots',
          desc: 'An ordinary leather boots.',
          slot: EquipmentType.BOOTS,
          stats: {
            agility: 10,
          },
          iconUrl: 'images/leather_boots',
        },
      },
      {
        instanceId: 1,
        durability: 80,
        maxDurability: 100,
        item: {
          id: 6,
          name: 'Iron Boots',
          desc: 'An sturdy iron boots.',
          slot: EquipmentType.BOOTS,
          stats: {
            agility: 6,
          },
          iconUrl: 'images/iron_boots',
        },
      },
      {
        instanceId: 2,
        durability: 77,
        maxDurability: 100,
        item: {
          id: 6,
          name: 'Iron Boots',
          desc: 'An sturdy iron boots.',
          slot: EquipmentType.BOOTS,
          stats: {
            agility: 6,
          },
          iconUrl: 'images/iron_boots',
        },
      },
      {
        quantity: 99,
        item: {
          id: 7,
          name: 'HP Potion',
          desc: 'Recover health.',
          type: ConsumableType.HP_POTION,
          stats: {
            health: 10,
          },
          iconUrl: 'images/health_potion',
        },
      },
      {
        quantity: 2,
        item: {
          id: 7,
          name: 'HP Potion',
          desc: 'Recover health.',
          type: ConsumableType.HP_POTION,
          stats: {
            health: 10,
          },
          iconUrl: 'images/health_potion',
        },
      },
      {
        quantity: 3,
        item: {
          id: 8,
          name: 'MP Potion',
          desc: 'Recover mana.',
          type: ConsumableType.MP_POTION,
          stats: {
            mana: 5,
          },
          iconUrl: 'images/mana_potion',
        },
      },
    ],
  },
};
