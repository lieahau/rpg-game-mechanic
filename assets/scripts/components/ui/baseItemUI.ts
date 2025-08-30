import { _decorator, Component, director, EventMouse, Node } from 'cc';
import { Item } from '../../models/item';
import { GlobalGameEvents } from '../../types/gameEvents';
const { ccclass } = _decorator;

@ccclass('BaseItemUI')
export abstract class BaseItemUI extends Component {
  protected abstract data: Item;

  abstract getData(): Item;

  onDestroy() {
    this.node.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
  }

  onLoad() {
    this.node.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
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
}
