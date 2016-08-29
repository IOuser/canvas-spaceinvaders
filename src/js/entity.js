import Sprite from './utils/sprite';


const MAX_SPEED = 1000;


export default class Entity {
  constructor(params) {
    this.type   = params.type || 'Entity';
    this.force  = params.force || [0, 0];
    this.speed  = params.speed || [0, 0];
    this.bounds = params.bounds || [20, 20];
    this.pos    = params.pos || [0, 0];
    this.sprite = params.sprite ? new Sprite(...params.sprite) : {};

    this.K      = 0.95;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    this.sprite.render(ctx);

    // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    // ctx.fillRect(0, 0, this.bounds[0], this.bounds[1]);

    ctx.restore();
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
    if(Math.abs(this.speed[1]) < MAX_SPEED) {
      this.speed[1] += this.force[1] * dt;
    } else {
      if(this.speed[1] > 0) {
        this.speed[1] = MAX_SPEED
      }
      if(this.speed[1] < 0) {
        this.speed[1] = -MAX_SPEED
      }
    }

    // reset force
    this.force[0] = 0;
    this.force[1] = 0;

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
    if(Math.abs(this.speed[1]) < 1) {
      this.speed[1] = 0;
    } else {
      if(this.speed[1] > 0) {
        this.speed[1] = this.speed[1] * this.K;
      }
      if(this.speed[1] < 0) {
        this.speed[1] = -Math.abs(this.speed[1]) * this.K;
      }
    }

    this.pos[0] += this.speed[0] * dt;
    this.pos[1] += this.speed[1] * dt;

    this.sprite.update ? this.sprite.update(dt) : null;
  }

  checkCollision(entity) {
    if(this.pos[0] < entity.pos[0] + entity.bounds[0] &&
       this.pos[0] + this.bounds[0] > entity.pos[0] &&
       this.pos[1] < entity.pos[1] + entity.bounds[1] &&
       this.pos[1] + this.bounds[1] > entity.pos[1]) {
        // collision detected!
        // console.log('collision', this, entity);
        return true;
    }
    return false;
  }
}