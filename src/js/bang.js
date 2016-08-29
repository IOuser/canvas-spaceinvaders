import Entity from './entity';
import { FxPool } from './objects-pool';

import Audio from './utils/audio';
export default class Bang extends Entity {
  constructor(params) {
    params.type = 'Bang';
    params.bounds = [39, 39];
    params.sprite = ['sprite', [0, 117], [39, 39], 20, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]];
    super(params);

    this.lifeTime = 0;

    switch(Math.floor(Math.random() * 4) + 1) {
      case 1:
        Audio.play('bang1');
        break;
      case 2:
        Audio.play('bang2');
        break;
      case 3:
        Audio.play('bang3');
        break;
      case 4:
        Audio.play('bang4');
        break;
    }
  }

  update(dt) {
    this.lifeTime += dt;
    if(this.lifeTime > 0.5) {
      FxPool.splice(FxPool.indexOf(this), 1);
      return;
    }

    this.sprite.update(dt);
  }
}