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
}
