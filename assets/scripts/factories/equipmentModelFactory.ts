import { Equipment } from '../models/equipment';
import { EquipmentType } from '../models/types/enums';
import { IEquipmentItem, IEquipmentSlots } from '../models/types/interfaces';
import { IEntityFactory } from '../types/interfaces';

export class EquipmentModelFactory implements IEntityFactory<Equipment> {
  private static _instance: EquipmentModelFactory;

  public static get instance(): EquipmentModelFactory {
    if (!this._instance) {
      this._instance = new EquipmentModelFactory();
    }
    return this._instance;
  }

  create(data: IEquipmentItem): Equipment {
    return new Equipment(data);
  }

  createBulk(data: IEquipmentItem[]): Equipment[] {
    return data.map((item) => new Equipment(item));
  }

  createFromMap(dataMap: IEquipmentSlots): Equipment[] {
    return Object.values(dataMap)
      .filter((data) => Object.values(EquipmentType).includes(data?.item.slot))
      .map((data) => new Equipment(data));
  }
}
