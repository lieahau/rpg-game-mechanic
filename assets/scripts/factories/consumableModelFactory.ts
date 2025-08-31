import { Consumable } from '../models/consumable';
import { IConsumableItem } from '../models/types/interfaces';
import { IEntityFactory } from '../types/interfaces';

export class ConsumableModelFactory implements IEntityFactory<Consumable> {
  private static _instance: ConsumableModelFactory;

  public static get instance(): ConsumableModelFactory {
    if (!this._instance) {
      this._instance = new ConsumableModelFactory();
    }
    return this._instance;
  }

  create(data: IConsumableItem): Consumable {
    return new Consumable(data);
  }

  createBulk(data: IConsumableItem[]): Consumable[] {
    return data.map((item) => new Consumable(item));
  }
}
