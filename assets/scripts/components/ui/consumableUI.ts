import { _decorator, Label, Sprite, SpriteFrame } from 'cc';
import { BaseItemUI } from './baseItemUI';
import { Consumable } from '../../models/consumable';
const { ccclass, property } = _decorator;

@ccclass('ConsumableUI')
export class ConsumableUI extends BaseItemUI {
  protected data: Consumable;

  @property(Label)
  private quantityLabel?: Label;

  getData() {
    return this.data;
  }

  setData(data: Consumable) {
    this.data = data;
    if (this.quantityLabel) {
      this.quantityLabel.string = data.getQuantity().toString();
    }
  }

  setSpriteFrame(spriteFrame: SpriteFrame) {
    const sprite = this.getComponent(Sprite);
    if (sprite) {
      sprite.spriteFrame = spriteFrame;
    }
  }

  updateQuantity() {
    if (this.quantityLabel) {
      this.quantityLabel.string = this.data.getQuantity().toString();
    }
  }

  protected getTooltipContent(): string {
    return `${this.data.item.name}\n\nEffect: ${JSON.stringify(this.data.item.stats, null, 2)}`;
  }

  protected getDetailContent(): string {
    return `ID: ${this.data.item.id}\n\n${this.data.item.name}\n\n${this.data.item.desc}\n\nEffect: ${JSON.stringify(this.data.item.stats, null, 2)}`;
  }
}
