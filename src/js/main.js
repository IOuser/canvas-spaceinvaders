require('../scss/main.scss');


import Resources from './utils/resources';
import Input from './utils/input';

// import Entity from './entity';
import Player from './player';
import Enemy from './enemy';
import Bang from './bang';

import { EnemiesPool, EnemiesBulletsPool, BulletsPool, FxPool } from './objects-pool';

import Level from './level';

// basic init
let RAF = window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          (callback => window.setTimeout(callback, 1000 / 60));

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

let canvasSize = windowWidth > windowHeight ? windowHeight : windowWidth;

// Create the canvas
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

canvas.width = canvasSize;
canvas.height = canvasSize;

document.body.appendChild(canvas);

Level.height = canvasSize;
Level.width = canvasSize;

let playerAcceleration = 3000;

let player = new Player({
  pos: [canvasSize / 2, canvasSize - 50]
});


Resources.load([
  { name: 'sprite', type: 'img', url: './src/img/sprites.png' },
  { name: 'bang1', type: 'audio', url: './src/audio/1.wav' },
  { name: 'bang2', type: 'audio', url: './src/audio/8.wav' },
  { name: 'bang3', type: 'audio', url: './src/audio/9.wav' },
  { name: 'bang4', type: 'audio', url: './src/audio/10.wav' },
  { name: 'playerShoot1', type: 'audio', url: './src/audio/2.wav' },
  { name: 'playerShoot2', type: 'audio', url: './src/audio/3.wav' },
  { name: 'playerShoot3', type: 'audio', url: './src/audio/4.wav' },
  { name: 'enemyShoot1', type: 'audio', url: './src/audio/5.wav' },
  { name: 'enemyShoot2', type: 'audio', url: './src/audio/6.wav' },
  { name: 'enemyShoot3', type: 'audio', url: './src/audio/7.wav' }
]);

Resources.onReady(init);
// void(init)


function init() {
  EnemiesPool.splice(0, EnemiesPool.length);
  EnemiesBulletsPool.splice(0, EnemiesBulletsPool.length);
  BulletsPool.splice(0, BulletsPool.length);
  FxPool.splice(0, FxPool.length);

  pause = false;
  player.hp = 3;
  generateLevel();
  main()
}

function generateLevel() {
  for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 5; j++) {
      EnemiesPool.push(new Enemy({
        pos: [canvasSize / 15 * i + canvasSize / 5, 30 * j + 10]
      }));
    }
  }
}

function gameOver() {
  pause = true;
  alert('Game over');
  init();
}

function win() {
  pause = true;
  alert('You win');
  init();
}




//////////////////////////////////////////////////////
// main loop

let lastTime = Date.now();
let now = Date.now();
let dt = (now - lastTime) / 1000.0;
let pause = false;

function main() {
  if(pause) return;
  now = Date.now();
  dt = (now - lastTime) / 1000.0;

  update(dt);
  render();

  lastTime = now;
  RAF(main);
}



//////////////////////////////////////////////////////
// main update

let enemiesTickTimer = 0,
    enemiesDirection = 1,
    goDown = false,
    enemiesForce = 6000;

function update(dt) {
  // player
  handleInput();
  player.update(dt);

  // player bullets
  bulletsUpdate:
  for(let i = 0; i < BulletsPool.length; i++) {
    // check collision [bullets] x [enemies]
    for(let j = 0; j < EnemiesPool.length; j++) {
      if(BulletsPool[i].checkCollision(EnemiesPool[j])) {
        FxPool.push(new Bang({
          pos: [EnemiesPool[j].pos[0] - 10, EnemiesPool[j].pos[1] - 10]
        }));
        BulletsPool.splice(i, 1);
        EnemiesPool.splice(j, 1);
        if(EnemiesPool.length == 0) {
          win();
        }
        continue bulletsUpdate;
      }
    }

    BulletsPool[i].update(dt);
  }


  // enemies movement
  enemiesTickTimer += dt;
  if(enemiesTickTimer > 2) {
    enemiesTickTimer = 0;

    for(let i = 0; i < EnemiesPool.length; i++) {
      if(EnemiesPool[i].pos[0] > Level.width - EnemiesPool[i].bounds[0]) {
        enemiesDirection = -1;
        goDown = true;
        break;
      }
      if(EnemiesPool[i].pos[0] < 0) {
        enemiesDirection = 1;
        goDown = true;
        break;
      }
    }

    for(let i = 0; i < EnemiesPool.length; i++) {
      EnemiesPool[i].force[0] = enemiesDirection * enemiesForce;
      if(goDown) {
        EnemiesPool[i].force[1] = enemiesForce * 2;
      }
    }

    if(goDown) {
      goDown = false;
    }
  }

  // enemies shoot
  for(let i = 0; i < EnemiesPool.length; i++) {
    EnemiesPool[i].update(dt);
    if(EnemiesPool[i].pos[1] > Level.height - 100){
      gameOver();
    }
    if(Math.random() > 0.9995 - (1 / EnemiesPool.length) * 0.01 ) {
      EnemiesPool[i].shoot();
    }
  }

  // enemies bullets
  EnemiesBulletsUpdate:
  for(let i = 0; i < EnemiesBulletsPool.length; i++) {
    // check collision [bullets] x [player]
    if(EnemiesBulletsPool[i].checkCollision(player)) {
      FxPool.push(new Bang({
        pos: [player.pos[0] - 10, player.pos[1] - 10]
      }));
      EnemiesBulletsPool.splice(i, 1);

      if(player.hp > 0) {
        --player.hp;
      } else {
        gameOver();
      }

      continue EnemiesBulletsUpdate;
    }

    EnemiesBulletsPool[i].update(dt);
  }


  // fx
  for(let i = 0; i < FxPool.length; i++) {
    FxPool[i].update(dt);
  }
}


function handleInput() {
  if(Input.isDown('LEFT') || Input.isDown('a')) {
    player.force[0] = -playerAcceleration;
  }

  if(Input.isDown('RIGHT') || Input.isDown('d')) {
    player.force[0] = playerAcceleration;
  }

  if(Input.isDown('SPACE')) {
    player.shoot();
  }
}



//////////////////////////////////////////////////////
// main render
function render() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  ctx.save();
  ctx.translate(0, 0);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.restore();

  player.render(ctx);

  for(let i = 0; i < EnemiesPool.length; i++) {
    EnemiesPool[i].render(ctx);
  }

  for(let i = 0; i < BulletsPool.length; i++) {
    BulletsPool[i].render(ctx);
  }

  for(let i = 0; i < EnemiesBulletsPool.length; i++) {
    EnemiesBulletsPool[i].render(ctx);
  }

  for(let i = 0; i < FxPool.length; i++) {
    FxPool[i].render(ctx);
  }
}
