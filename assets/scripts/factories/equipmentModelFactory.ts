import { Equipment } from '../models/equipment';
import { IEquipment } from '../models/types/interfaces';
import { IEntityFactory } from '../types/interfaces';

export class EquipmentModelFactory implements IEntityFactory<Equipment> {
  private static _instance: EquipmentModelFactory;

  public static get instance(): EquipmentModelFactory {
    if (!this._instance) {
      this._instance = new EquipmentModelFactory();
    }
    return this._instance;
  }

  create(data: IEquipment): Equipment {
    return new Equipment(data);
  }

  createMany(dataArray: IEquipment[]): Equipment[] {
    return dataArray.map((data) => new Equipment(data));
  }
}
