import { _decorator, Component, EventTarget, Node } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
import { EquipmentType } from '../../models/types/enums';
import { Equipment } from '../../models/equipment';
import { EquipmentUI } from './equipmentUI';
import { EquipmentUIFactory } from '../../factories/equipmentUIFactory';
const { ccclass, property } = _decorator;

@ccclass('EquipmentSlotsUI')
export class EquipmentSlotsUI extends Component {
  @property(Node)
  private helmetSlot?: Node;

  @property(Node)
  private armorSlot?: Node;

  @property(Node)
  private bootSlot?: Node;

  private helmetUI?: EquipmentUI;
  private armorUI?: EquipmentUI;
  private bootUI?: EquipmentUI;

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

  private onPlayerEquipmentChanged(dataMap: Map<EquipmentType, Equipment>) {
    try {
      dataMap.forEach(async (equipment, type) => {
        let slotNode: Node | undefined;
        let currentUIRef: EquipmentUI | undefined;

        switch (type) {
          case EquipmentType.HELMET:
            slotNode = this.helmetSlot;
            currentUIRef = this.helmetUI;
            break;
          case EquipmentType.ARMOR:
            slotNode = this.armorSlot;
            currentUIRef = this.armorUI;
            break;
          case EquipmentType.BOOTS:
            slotNode = this.bootSlot;
            currentUIRef = this.bootUI;
            break;
        }

        if (!slotNode) return;

        // Check if existing UI already matches this equipment
        if (currentUIRef?.getData() === equipment) return;

        // Remove old UI if exists
        slotNode.removeAllChildren();

        // Create new EquipmentUI
        const equipmentNode = await EquipmentUIFactory.instance.create(equipment);
        slotNode.addChild(equipmentNode);

        // Save reference
        const equipmentUI = equipmentNode.getComponent(EquipmentUI);
        switch (type) {
          case EquipmentType.HELMET:
            this.helmetUI = equipmentUI;
            break;
          case EquipmentType.ARMOR:
            this.armorUI = equipmentUI;
            break;
          case EquipmentType.BOOTS:
            this.bootUI = equipmentUI;
            break;
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to change equipment slots UI: ', error);
    }
  }
}
