import { _decorator, Color, Component, EventTarget, Label, Node } from 'cc';
import { InventoryGameEvents, PlayerGameEvents } from '../../types/gameEvents';
import { EquipmentType } from '../../models/types/enums';
import { Equipment } from '../../models/equipment';
import { InventorySlotsUIFactory } from '../../factories/inventorySlotsUIFactory';
import { EquipmentUIFactory } from '../../factories/equipmentUIFactory';
import { InventorySlotUI } from './inventorySlotUI';
import { InventorySystem } from '../../models/inventorySystem';
import { Consumable } from '../../models/consumable';
import { ConsumableUIFactory } from '../../factories/consumableUIFactory';
import { ConsumableUI } from './consumableUI';
const { ccclass, property } = _decorator;

@ccclass('InventoryUI')
export class InventoryUI extends Component {
  @property(Node)
  private grid?: Node;

  @property(Label)
  private limitLabel?: Label;

  private inventorySystem: InventorySystem;

  private playerEventTarget?: EventTarget;

  private eventTarget: EventTarget = new EventTarget();

  private slots: InventorySlotUI[] = [];

  onDestroy() {
    this.setPlayerEventListenersOff();
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

  getEventTarget() {
    return this.eventTarget;
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
    this.playerEventTarget?.on(
      PlayerGameEvents.PLAYER_CONSUMABLE_USED,
      this.onPlayerConsumableUsed,
      this
    );
  }

  private setPlayerEventListenersOff() {
    this.playerEventTarget?.off(
      PlayerGameEvents.PLAYER_EQUIPMENT_CHANGED,
      this.onPlayerEquipmentChanged,
      this
    );
    this.playerEventTarget?.on(
      PlayerGameEvents.PLAYER_CONSUMABLE_USED,
      this.onPlayerConsumableUsed,
      this
    );
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

  getConsumableInventorySlotUIs(consumable: Consumable): InventorySlotUI[] {
    return this.slots.filter((slot) => {
      const data = slot.getContentData();
      if (!(data instanceof Consumable)) return false;

      return data.item.id === consumable.item.id;
    });
  }

  private async initEmptySlots() {
    try {
      const maxSlots = this.inventorySystem.getMaxSlots();
      const itemsAmount = this.inventorySystem.getFilledSlotsAmount();
      this.slots = await InventorySlotsUIFactory.instance.createBulk(
        Math.max(maxSlots, itemsAmount),
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
        const item = items[i];
        if (item instanceof Equipment) {
          const content = await EquipmentUIFactory.instance.create(item);
          this.slots[i].setContent(content);

          // set overlay to diferentiate the equipped equipments
          const isEquipped = equipments.some((eq) => item.isSame(eq));
          this.slots[i].setOverlay(isEquipped);
        } else if (item instanceof Consumable) {
          const content = await ConsumableUIFactory.instance.create(item);
          this.slots[i].setContent(content);
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  private onPlayerEquipmentChanged(
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

  private onPlayerConsumableUsed(item: Consumable) {
    const slotUIs = this.getConsumableInventorySlotUIs(item);

    slotUIs.forEach((slot) => {
      const contentUI = slot.getContentItemUI() as ConsumableUI;
      contentUI.updateQuantity();
      if (contentUI.getData().getQuantity() === 0) {
        slot.setContent(null);
        this.setLimitLabel();
        if (slotUIs.length === 1) {
          // if this is the only slot and consumable's quantity reached 0, then inform the itemDetailsUI
          this.eventTarget.emit(InventoryGameEvents.INVENTORY_CONSUMABLE_EMPTIED);
        }
      }
    });
  }

  private setLimitLabel() {
    if (this.limitLabel) {
      const filledSlots = this.inventorySystem.getFilledSlotsAmount();
      const maxSlots = this.getMaxSlots();
      this.limitLabel.string = `${filledSlots}/${maxSlots}`;

      if (filledSlots > maxSlots) this.limitLabel.color = Color.RED;
      else this.limitLabel.color = Color.WHITE;
    }
  }
}
