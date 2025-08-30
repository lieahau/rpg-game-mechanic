import { _decorator, Component, director, EventMouse, Node } from 'cc';
import { Item } from '../../models/item';
import { GlobalGameEvents } from '../../types/gameEvents';
const { ccclass } = _decorator;

@ccclass('BaseItemUI')
export abstract class BaseItemUI extends Component {
  protected abstract data: Item;

  abstract getData(): Item;

  onLoad() {
    this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.node.on(Node.EventType.TOUCH_START, this.onClick, this);
  }

  onDestroy() {
    this.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.node.off(Node.EventType.TOUCH_START, this.onClick, this);
  }

  protected onClick() {
    director.emit(GlobalGameEvents.ITEM_CLICK, this.getData(), this.getDetailContent());
  }

  protected onMouseEnter(event: EventMouse) {
    director.emit(
      GlobalGameEvents.ITEM_HOVER_ENTER,
      event.getUILocation(),
      this.getTooltipContent()
    );
  }

  protected onMouseLeave(event: EventMouse) {
    director.emit(
      GlobalGameEvents.ITEM_HOVER_LEAVE,
      event.getUILocation(),
      this.getTooltipContent()
    );
  }

  protected getTooltipContent(): string {
    return 'Unknown Item';
  }

  protected getDetailContent(): string {
    return 'Unknown Item';
  }
}
