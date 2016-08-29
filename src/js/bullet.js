import Entity from './entity';
import Level from './level';
import { EnemiesBulletsPool, BulletsPool } from './objects-pool';



export default class Bullet extends Entity {
  constructor(params) {
    params = {
      ...params,
      type: 'Bullet',
      bounds: [1, 10]
    };
    super(params)
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);

    ctx.fillStyle = 'rgba(255, 255, 0, .95)';
    ctx.fillRect(0, 0, this.bounds[0], this.bounds[1]);

    ctx.restore();
  }

  update(dt) {
    this.pos[1] += this.speed[1] * dt;

    // remove
    if(this.pos[1] < 0) {
      BulletsPool.splice(BulletsPool.indexOf(this), 1);
    }
    if(this.pos[1] > Level.height) {
      EnemiesBulletsPool.splice(EnemiesBulletsPool.indexOf(this), 1);
    }
  }
}