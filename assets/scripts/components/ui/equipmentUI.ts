import { _decorator, Sprite, SpriteFrame } from 'cc';
import { Equipment } from '../../models/equipment';
import { BaseItemUI } from './baseItemUI';
const { ccclass } = _decorator;

@ccclass('EquipmentUI')
export class EquipmentUI extends BaseItemUI {
  protected data: Equipment;

  getData() {
    return this.data;
  }

  setData(data: Equipment) {
    this.data = data;
  }

  setSpriteFrame(spriteFrame: SpriteFrame) {
    const sprite = this.getComponent(Sprite);
    if (sprite) {
      sprite.spriteFrame = spriteFrame;
    }
  }

  protected getTooltipContent(): string {
    return `${this.data.item.name}\nType: ${this.data.item.slot}\nStats: ${JSON.stringify(this.data.item.stats, null, 2)}`;
  }

  protected getDetailContent(): string {
    return `Instance ID: ${this.data.instanceId}\nID: ${this.data.item.id}\n\n${this.data.item.name}\nType: ${this.data.item.slot}\nDurability: ${this.data.durability}/${this.data.maxDurability}\n\n${this.data.item.desc}\n\nStats: ${JSON.stringify(this.data.item.stats, null, 2)}`;
  }
}
