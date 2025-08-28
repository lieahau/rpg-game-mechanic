import { EquipmentType } from './types/enums';
import { IStats, IEquipment } from './types/interfaces';

export class Equipment implements IEquipment {
  readonly id: number;
  readonly name: string;
  readonly slot: EquipmentType;
  readonly desc: string;
  readonly stats: Partial<IStats>;

  constructor(data: IEquipment) {
    this.id = data.id;
    this.name = data.name;
    this.slot = data.slot;
    this.desc = data.desc;
    this.stats = data.stats;
  }
}
