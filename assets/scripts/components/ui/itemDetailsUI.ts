import { _decorator, Button, Component, EventTarget, Label, Node } from 'cc';
import { ItemDetailsType } from '../../types/enums';
import { PlayerGameEvents } from '../../types/gameEvents';
import { Item } from '../../models/item';
import { Equipment } from '../../models/equipment';
const { ccclass, property } = _decorator;

@ccclass('ItemDetailsUI')
export class ItemDetailsUI extends Component {
  @property(Node)
  private view?: Node;

  @property(Button)
  private useButton?: Button;

  @property(Label)
  private useButtonLabel?: Label;

  @property(Button)
  private closeButton?: Button;

  @property(Label)
  private content?: Label;

  private itemDetailsType = ItemDetailsType.CAN_EQUIP;

  private playerEventTarget: EventTarget;

  private item: Item;

  onLoad() {
    if (this.view) this.view.active = false;
    this.closeButton?.node.on(Button.EventType.CLICK, this.onClickClose, this);
    this.useButton?.node.on(Button.EventType.CLICK, this.onClickUse, this);
  }

  onDestroy() {
    this.closeButton?.node.off(Button.EventType.CLICK, this.onClickClose, this);
    this.useButton?.node.off(Button.EventType.CLICK, this.onClickUse, this);
  }

  setPlayerEventTarget(eventTarget: EventTarget) {
    this.setPlayerEventListenersOff();
    this.playerEventTarget = eventTarget;
    this.setPlayerEventListenersOn();
  }

  private setPlayerEventListenersOn() {
    this.playerEventTarget?.on(
      PlayerGameEvents.PLAYER_EQUIPMENT_CHANGED,
      this.onPlayerEquipmentChanged,
      this
    );
  }

  private setPlayerEventListenersOff() {
    this.playerEventTarget?.off(
      PlayerGameEvents.PLAYER_EQUIPMENT_CHANGED,
      this.onPlayerEquipmentChanged,
      this
    );
  }

  show(itemDetailsType: ItemDetailsType, item: Item, content: string = '') {
    if (!this.view) return;
    this.view.active = true;

    this.itemDetailsType = itemDetailsType;
    this.item = item;

    if (this.useButtonLabel) {
      this.useButtonLabel.string = itemDetailsType;
    }

    if (this.content) {
      this.content.string = content;
    }
  }

  private onClickClose() {
    this.view.active = false;
  }

  private onClickUse() {
    switch (this.itemDetailsType) {
      case ItemDetailsType.CAN_EQUIP:
        this.playerEventTarget.emit(PlayerGameEvents.PLAYER_EQUIPMENT_EQUIPPING, this.item);
        break;
      case ItemDetailsType.CAN_UNEQUIP:
        this.playerEventTarget.emit(
          PlayerGameEvents.PLAYER_EQUIPMENT_UNEQUIPPING,
          (this.item as Equipment).item.slot
        );
        break;

      default:
        break;
    }
  }

  private onPlayerEquipmentChanged() {
    if (!this.view?.active || !this.content || !this.item) return;

    switch (this.itemDetailsType) {
      case ItemDetailsType.CAN_EQUIP:
        this.show(ItemDetailsType.CAN_UNEQUIP, this.item, this.content.string);
        break;
      case ItemDetailsType.CAN_UNEQUIP:
        this.show(ItemDetailsType.CAN_EQUIP, this.item, this.content.string);
        break;
    }
  }
}
