import { _decorator, Component } from 'cc';
import { Item } from '../../models/item';
const { ccclass } = _decorator;

@ccclass('BaseItemUI')
export abstract class BaseItemUI extends Component {
  protected abstract data: Item;

  abstract getData(): Item;
}
