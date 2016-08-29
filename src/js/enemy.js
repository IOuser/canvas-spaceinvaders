import Entity from './entity';
import Bullet from './bullet';

import Audio from './utils/audio';

import { EnemiesBulletsPool } from './objects-pool';



export default class Enemy extends Entity {
  constructor(params) {
    params = {
      ...params,
      type: 'Enemy',
      speed: [0, 0],
      bounds: [20, 20],
      sprite: ['sprite', [0, 156], [20, 20], 7, [0, 1, 2]]
    };
    super(params);
  }

  shoot() {
    switch(Math.floor(Math.random() * 3) + 1) {
      case 1:
        Audio.play('enemyShoot1');
        break;
      case 2:
        Audio.play('enemyShoot2');
        break;
      case 3:
        Audio.play('enemyShoot3');
        break;
    }

    EnemiesBulletsPool.push(new Bullet({
      speed: [0, 100],
      pos: [this.pos[0] + this.bounds[0] / 2 - 5, this.pos[1]]
    }));
  }
}