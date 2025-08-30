import { _decorator, Component, Node, Label, UITransform, director, view, Vec2 } from 'cc';
import { GlobalGameEvents } from '../../types/gameEvents';
const { ccclass, property } = _decorator;

@ccclass('TooltipUI')
export class TooltipUI extends Component {
  @property(Node)
  private view?: Node;

  @property(Label)
  private contentLabel?: Label;

  private padding: number = 10;

  onLoad() {
    this.view.active = false;
    director.on(GlobalGameEvents.ITEM_HOVER_ENTER, this.show, this);
    director.on(GlobalGameEvents.ITEM_HOVER_LEAVE, this.hide, this);
  }

  onDestroy() {
    director.off(GlobalGameEvents.ITEM_HOVER_ENTER, this.show, this);
    director.off(GlobalGameEvents.ITEM_HOVER_LEAVE, this.hide, this);
  }

  show(uiPos: Vec2, content: string = '') {
    if (this.contentLabel) {
      this.contentLabel.string = content;
    }
    this.view.active = true;
    this.adjustPosition(uiPos);
  }

  hide() {
    this.view.active = false;
  }

  private adjustPosition(uiPos: Vec2) {
    const uiTransform = this.view.getComponent(UITransform);
    if (!uiTransform) return;

    const { x, y } = uiPos;
    const screenSize = view.getVisibleSize();
    const tooltipSize = uiTransform.contentSize;

    // Screen center
    const centerX = screenSize.width / 2;
    const centerY = screenSize.height / 2;

    let posX: number;
    let posY: number;

    // Cursor on left side of screen, tooltip to the right of cursor
    if (x < centerX) {
      posX = x + this.padding;
    } else {
      // Cursor on right side of screen, tooltip to the left of cursor
      posX = x - tooltipSize.width / 2 - this.padding;
    }

    // Cursor on top side of screen, tooltip below cursor
    if (y > centerY) {
      posY = y - tooltipSize.height / 2 - this.padding;
    } else {
      // Cursor on bottom side of screen, tooltip above cursor
      posY = y + this.padding;
    }

    // Keep tooltip inside screen boundaries
    posX = Math.max(0, Math.min(posX, screenSize.width - tooltipSize.width / 2));
    posY = Math.max(0, Math.min(posY, screenSize.height - tooltipSize.height / 2));

    this.node.setWorldPosition(posX, posY, 0);
  }
}
