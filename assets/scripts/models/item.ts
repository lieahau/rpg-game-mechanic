import { ItemType } from './types/enums';

/**
 * A base class for Equipment and Consumable
 */
export abstract class Item {
  abstract getType(): ItemType;
}
