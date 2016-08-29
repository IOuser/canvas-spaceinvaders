import Entity from './entity';
import Bullet from './bullet';

import Audio from './utils/audio';
// import { debounce } from './utils/utils';

import throttle from 'throttle-debounce/throttle';

import { BulletsPool } from './objects-pool';



const MAX_SPEED = 1000;
import Level from './level';



export default class Player extends Entity {
  constructor(params) {
    params = {
      ...params,
      type: 'Player',
      bounds: [39, 39],
      sprite: ['sprite', [0, 0], [39, 39], 16, [0, 1]]
    };

    super(params);

    this.shoot = throttle(300, true, shoot.bind(this));
    this.hp = 3;
  }


  update(dt) {
    // acceleration
    if(Math.abs(this.speed[0]) < MAX_SPEED) {
      this.speed[0] += this.force[0] * dt;
    } else {
      if(this.speed[0] > 0) {
        this.speed[0] = MAX_SPEED
      }
      if(this.speed[0] < 0) {
        this.speed[0] = -MAX_SPEED
      }
    }

    // reset force
    this.force[0] = 0;

    // slowdown
    if(Math.abs(this.speed[0]) < 1) {
      this.speed[0] = 0;
    } else {
      if(this.speed[0] > 0) {
        this.speed[0] = this.speed[0] * this.K;
      }
      if(this.speed[0] < 0) {
        this.speed[0] = -Math.abs(this.speed[0]) * this.K;
      }
    }

    this.pos[0] += this.speed[0] * dt;

    if(this.pos[0] < 0) {
      this.speed[0] = 0;
      this.pos[0] = 0;
    }
    if(this.pos[0] + this.bounds[0] > Level.width) {
      this.speed[0] = 0;
      this.pos[0] = Level.width - this.bounds[0];
    }

    this.sprite.update(dt);
  }

}


function shoot() {

  switch(Math.floor(Math.random() * 3) + 1) {
    case 1:
      Audio.play('playerShoot1');
      break;
    case 2:
      Audio.play('playerShoot2');
      break;
    case 3:
      Audio.play('playerShoot3');
      break;
  }

  BulletsPool.push(new Bullet({
    speed: [0, -100],
    pos: [this.pos[0] + this.bounds[0] / 2 - 5, this.pos[1]]
  }));
}