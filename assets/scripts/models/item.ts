import { ItemType } from './types/enums';

export abstract class Item {
  abstract getType(): ItemType;
}
