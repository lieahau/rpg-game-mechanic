import { _decorator, Component, EventTarget, Label, Node } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
import { EquipmentType, ItemType } from '../../models/types/enums';
import { Equipment } from '../../models/equipment';
import { InventorySlotsUIFactory } from '../../factories/inventorySlotsUIFactory';
import { EquipmentUIFactory } from '../../factories/equipmentUIFactory';
import { InventorySlotUI } from './inventorySlotUI';
import { InventorySystem } from '../../models/inventorySystem';
const { ccclass, property } = _decorator;

@ccclass('InventoryUI')
export class InventoryUI extends Component {
  @property(Node)
  private grid?: Node;

  @property(Label)
  private limitLabel?: Label;

  private inventorySystem: InventorySystem;

  private playerEventTarget?: EventTarget;

  private slots: InventorySlotUI[] = [];

  onDestroy() {
    this.setPlayerEventListenersOff();
  }

  getMaxSlots(): number {
    return this.inventorySystem.getMaxSlots();
  }

  getEquipmentInventorySlotUI(equipment: Equipment): InventorySlotUI {
    return this.slots.find((slot) => {
      const data = slot.getContentData();
      if (!(data instanceof Equipment)) return false;

      return data.isSame(equipment);
    });
  }

  setPlayerEventTarget(eventTarget: EventTarget) {
    this.setPlayerEventListenersOff();
    this.playerEventTarget = eventTarget;
    this.setPlayerEventListenersOn();
  }

  async init(inventorySystem: InventorySystem, equippedEquipments: Map<EquipmentType, Equipment>) {
    try {
      this.inventorySystem = inventorySystem;
      await this.initEmptySlots();
      await this.initSlotItems(equippedEquipments);
      this.setLimitLabel();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to init inventory UI: ', error);
    }
  }

  private async initEmptySlots() {
    try {
      this.slots = await InventorySlotsUIFactory.instance.createBulk(
        this.inventorySystem.getMaxSlots(),
        this.grid
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  private async initSlotItems(equippedEquipments: Map<EquipmentType, Equipment>) {
    try {
      const items = this.inventorySystem.getItems();
      const equipments = Array.from(equippedEquipments.values());
      for (let i = 0; i < items.length; i++) {
        if (items[i].getType() === ItemType.EQUIPMENT) {
          const item = items[i] as Equipment;
          const content = await EquipmentUIFactory.instance.create(item);

          this.slots[i].setContent(content);

          // set overlay to diferentiate the equipped equipments
          const isEquipped = equipments.some((eq) => item.isSame(eq));
          this.slots[i].setOverlay(isEquipped);
        } else {
          // TODO spawn consumable
        }
      }
    } catch (error) {
      throw new Error(error);
    }
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

  private async onPlayerEquipmentChanged(
    dataMap: Map<EquipmentType, Equipment>,
    previousItem?: Equipment,
    newItem?: Equipment
  ) {
    if (previousItem) {
      const slot = this.getEquipmentInventorySlotUI(previousItem);
      slot.setOverlay(false);
    }

    if (newItem) {
      const slot = this.getEquipmentInventorySlotUI(newItem);
      slot.setOverlay(true);
    }
  }

  private setLimitLabel() {
    if (this.limitLabel) {
      const filledSlots = this.inventorySystem.getFilledSlotsAmount();
      const maxSlots = this.getMaxSlots();
      this.limitLabel.string = `${filledSlots}/${maxSlots}`;
    }
  }
}
