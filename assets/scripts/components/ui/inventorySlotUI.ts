import { _decorator, Component, Node } from 'cc';
import { BaseItemUI } from './baseItemUI';
import { Item } from '../../models/item';
const { ccclass, property } = _decorator;

@ccclass('InventorySlotUI')
export class InventorySlotUI extends Component {
  @property(Node)
  private contentRoot?: Node;

  @property(Node)
  private overlay?: Node;

  private contentItem?: BaseItemUI;

  hasContent(): boolean {
    return !!this.contentItem;
  }

  getContentItemUI(): BaseItemUI {
    return this.contentItem;
  }

  getContentData(): Item | undefined {
    return this.contentItem?.getData();
  }

  setContent(content?: Node) {
    this.contentRoot?.destroyAllChildren();
    if (content) {
      this.contentItem = content?.getComponent(BaseItemUI);
      this.contentRoot?.addChild(content);
    }
  }

  setOverlay(value: boolean) {
    if (this.overlay) this.overlay.active = value;
  }
}
