import { _decorator, Component, Node } from 'cc';
import { IStats } from '../models/types/interfaces';
import { DataLoader } from './dataLoader';
import { PlayerFactory } from '../factories/playerFactory';
import { FILENAME } from '../types/enums';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  @property(Node)
  private gameplayRoot?: Node;

  start() {
    this.spawnPlayer();
  }

  async spawnPlayer() {
    if (!this.gameplayRoot) return;

    try {
      const playerData = await DataLoader.instance.loadJson<IStats>(FILENAME.JSON_PLAYER_DATA);
      const playerNode = await PlayerFactory.instance.create(playerData);

      this.gameplayRoot.addChild(playerNode);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load spawn player: ', error);
      return;
    }
  }
}
