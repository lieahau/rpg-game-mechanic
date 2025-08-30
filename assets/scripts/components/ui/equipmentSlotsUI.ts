import { _decorator, Component, EventTarget, Node } from 'cc';
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

  onDestroy() {
    this.setPlayerEventListenersOff();
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

  private async onPlayerEquipmentChanged(dataMap: Map<EquipmentType, Equipment>) {
    try {
      await this.updateSlotsUI(dataMap);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to change equipment slots UI: ', error);
    }
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

        if (!slotNode) continue;

        // Check if existing UI already matches this equipment
        if (equipment?.isSame(currentUIRef?.getData())) continue;

        slotNode.removeAllChildren();

        let equipmentUI: EquipmentUI | undefined;

        if (equipment) {
          const equipmentNode = await EquipmentUIFactory.instance.create(equipment, slotNode);
          equipmentUI = equipmentNode.getComponent(EquipmentUI);
        }

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
