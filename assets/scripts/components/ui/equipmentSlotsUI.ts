import { _decorator, Button, Component, EventTarget, Node } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
import { EquipmentType } from '../../models/types/enums';
import { Equipment } from '../../models/equipment';
import { EquipmentUI } from './equipmentUI';
import { EquipmentUIFactory } from '../../factories/equipmentUIFactory';
const { ccclass, property } = _decorator;

@ccclass('EquipmentSlotUI')
class EquipmentSlotUI {
  @property(Node)
  slot?: Node;

  ui?: EquipmentUI;

  @property(Button)
  unequipButton?: Button;
}

@ccclass('EquipmentSlotsUI')
export class EquipmentSlotsUI extends Component {
  @property(EquipmentSlotUI)
  private helmet: EquipmentSlotUI = new EquipmentSlotUI();

  @property(EquipmentSlotUI)
  private armor: EquipmentSlotUI = new EquipmentSlotUI();

  @property(EquipmentSlotUI)
  private boots?: EquipmentSlotUI = new EquipmentSlotUI();

  private playerEventTarget?: EventTarget;

  onLoad() {
    this.helmet.unequipButton?.node.on(Button.EventType.CLICK, this.onClickUnequipHelmet, this);
    this.armor.unequipButton?.node.on(Button.EventType.CLICK, this.onClickUnequipArmor, this);
    this.boots.unequipButton?.node.on(Button.EventType.CLICK, this.onClickUnequipBoots, this);
  }

  onDestroy() {
    this.setPlayerEventListenersOff();
    this.helmet.unequipButton?.node.off(Button.EventType.CLICK, this.onClickUnequipHelmet, this);
    this.armor.unequipButton?.node.off(Button.EventType.CLICK, this.onClickUnequipArmor, this);
    this.boots.unequipButton?.node.off(Button.EventType.CLICK, this.onClickUnequipBoots, this);
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

  private onClickUnequipHelmet() {
    this.playerEventTarget?.emit(
      PlayerGameEvents.PLAYER_EQUIPMENT_UNEQUIPPING,
      EquipmentType.HELMET
    );
  }

  private onClickUnequipArmor() {
    this.playerEventTarget?.emit(
      PlayerGameEvents.PLAYER_EQUIPMENT_UNEQUIPPING,
      EquipmentType.ARMOR
    );
  }

  private onClickUnequipBoots() {
    this.playerEventTarget?.emit(
      PlayerGameEvents.PLAYER_EQUIPMENT_UNEQUIPPING,
      EquipmentType.BOOTS
    );
  }

  private async onPlayerEquipmentChanged(dataMap: Map<EquipmentType, Equipment>) {
    try {
      await this.updateSlotsUI(dataMap);
      this.updateUnequipButtonStates();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to change equipment slots UI: ', error);
    }
  }

  private updateUnequipButtonStates() {
    if (this.helmet.unequipButton) this.helmet.unequipButton.interactable = !!this.helmet.ui;
    if (this.armor.unequipButton) this.armor.unequipButton.interactable = !!this.armor.ui;
    if (this.boots.unequipButton) this.boots.unequipButton.interactable = !!this.boots.ui;
  }

  private async updateSlotsUI(dataMap: Map<EquipmentType, Equipment>) {
    try {
      for (const [type, equipment] of dataMap) {
        let slotNode: Node | undefined;
        let currentUIRef: EquipmentUI | undefined;

        switch (type) {
          case EquipmentType.HELMET:
            slotNode = this.helmet.slot;
            currentUIRef = this.helmet.ui;
            break;
          case EquipmentType.ARMOR:
            slotNode = this.armor.slot;
            currentUIRef = this.armor.ui;
            break;
          case EquipmentType.BOOTS:
            slotNode = this.boots.slot;
            currentUIRef = this.boots.ui;
            break;
        }

        if (!slotNode) return;

        // Check if existing UI already matches this equipment
        if (currentUIRef?.getData().instanceId === equipment?.instanceId) return;

        // Remove old UI if exists
        slotNode.removeAllChildren();

        let equipmentUI: EquipmentUI | undefined;

        if (equipment) {
          // Create new EquipmentUI
          const equipmentNode = await EquipmentUIFactory.instance.create(equipment);
          slotNode.addChild(equipmentNode);
          equipmentUI = equipmentNode.getComponent(EquipmentUI);
        }

        // Save reference
        switch (type) {
          case EquipmentType.HELMET:
            this.helmet.ui = equipmentUI;
            break;
          case EquipmentType.ARMOR:
            this.armor.ui = equipmentUI;
            break;
          case EquipmentType.BOOTS:
            this.boots.ui = equipmentUI;
            break;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
