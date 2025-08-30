import { _decorator, Component, EventTarget, Label, Node } from 'cc';
import { PlayerGameEvents } from '../../types/gameEvents';
import { EquipmentType, ItemType } from '../../models/types/enums';
import { Equipment } from '../../models/equipment';
import { InventorySlotsUIFactory } from '../../factories/inventorySlotsUIFactory';
import { EquipmentUIFactory } from '../../factories/equipmentUIFactory';
import { InventorySlotUI } from './inventorySlotUI';
import { Item } from '../../models/item';
const { ccclass, property } = _decorator;

@ccclass('InventoryUI')
export class InventoryUI extends Component {
  @property(Node)
  private grid?: Node;

  @property(Label)
  private limitLabel?: Label;

  private playerEventTarget?: EventTarget;

  private maxSlots: number;

  private slots: InventorySlotUI[] = [];

  onDestroy() {
    this.setPlayerEventListenersOff();
  }

  getFilledSlots(): InventorySlotUI[] {
    return this.slots.filter((slot) => slot.hasContent());
  }

  getEquipmentInventorySlots(): InventorySlotUI[] {
    return this.getFilledSlots().filter(
      (slot) => slot.getContentData()?.getType() === ItemType.EQUIPMENT
    );
  }

  getEquipmentInventorySlot(equipmentInstanceId: number, equipmentId: number): InventorySlotUI {
    return this.getEquipmentInventorySlots().find((slot) => {
      const data = slot.getContentData() as Equipment;
      return data.instanceId === equipmentInstanceId && data.item.id === equipmentId;
    });
  }

  setMaxSlots(value: number) {
    this.maxSlots = value;
  }

  setPlayerEventTarget(eventTarget: EventTarget) {
    this.setPlayerEventListenersOff();
    this.playerEventTarget = eventTarget;
    this.setPlayerEventListenersOn();
  }

  async init(items: Item[], equippedEquipments: Map<EquipmentType, Equipment>) {
    try {
      await this.initEmptySlots();
      await this.initSlotItems(items, equippedEquipments);
      this.setLimitLabel();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to init inventory UI: ', error);
    }
  }

  private async initEmptySlots() {
    try {
      this.slots = await InventorySlotsUIFactory.instance.createBulk(this.maxSlots, this.grid);
    } catch (error) {
      throw new Error(error);
    }
  }

  private async initSlotItems(items: Item[], equippedEquipments: Map<EquipmentType, Equipment>) {
    try {
      const equipments = Array.from(equippedEquipments.values());
      for (let i = 0; i < items.length; i++) {
        if (items[i].getType() === ItemType.EQUIPMENT) {
          const item = items[i] as Equipment;
          const content = await EquipmentUIFactory.instance.create(item);

          this.slots[i].setContent(content);

          // set overlay to diferentiate the equipped equipments
          const isEquipped = equipments.some(
            (eq) => eq?.instanceId === item.instanceId && eq?.item.id === item.item.id
          );
          this.slots[i].setOverlay(isEquipped);
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
      const slot = this.getEquipmentInventorySlot(previousItem.instanceId, previousItem.item.id);
      slot.setOverlay(false);
    }

    if (newItem) {
      const slot = this.getEquipmentInventorySlot(newItem.instanceId, newItem.item.id);
      slot.setOverlay(true);
    }
  }

  private setLimitLabel() {
    if (this.limitLabel) {
      this.limitLabel.string = `${this.getFilledSlots().length}/${this.maxSlots}`;
    }
  }
}
