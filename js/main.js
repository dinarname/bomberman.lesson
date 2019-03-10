/*----------------------- Переменне для загрузки изображений ----------------*/
let stoneImg, grassImg, brickImg;
let bombermanImg = {
  back: 0,
  front: 0,
  left: 0,
  right: 0,
};

let bombImg = {
  burning: 0,
  exposion: 0,
};

let enemyImg = {
  back: 0,
  front: 0,
  left: 0,
  right: 0,
};

/*----------------------------------------------------------------------------*/


/*----------------------------- Группы и спрайт  -----------------------------*/
let greenField;
let wall;
let bricks;
let enemies;
let bombs;

let bomberman;
/*----------------------------------------------------------------------------*/


/*---------------------------- Переменные для создания поля ------------------*/
let rows = 13;
let cols = 17;
let w;
/*----------------------------------------------------------------------------*/


/*---------------------------- Предзагрузка изображений ----------------------*/
function preload() {
  // Изображения для создания игрового поля
  grassImg = loadImage("sprites/Blocks/BackgroundTile.png");
  stoneImg = loadImage("sprites/Blocks/SolidBlock.png");
  brickImg = loadImage("sprites/Blocks/ExplodableBlock.png");

  // Изображения для анимации бомбермена
  bombermanImg.back = loadAnimation("sprites/Bomberman/Back/Bman_B_f00.png", "sprites/Bomberman/Back/Bman_B_f07.png");
  bombermanImg.front = loadAnimation("sprites/Bomberman/Front/Bman_F_f00.png", "sprites/Bomberman/Front/Bman_F_f07.png");
  bombermanImg.left = loadAnimation("sprites/Bomberman/Left/Bman_L_f00.png", "sprites/Bomberman/Left/Bman_L_f07.png");
  bombermanImg.right = loadAnimation("sprites/Bomberman/Right/Bman_R_f00.png", "sprites/Bomberman/Right/Bman_R_f07.png");

  // Изображения для анимации бомбы
  bombImg.burning = loadAnimation("sprites/Bomb/Bomb_f01.png", "sprites/Bomb/Bomb_f03.png");
  bombImg.explosion = loadAnimation("sprites/Flame/Flame_f00.png", "sprites/Flame/Flame_f04.png");

  // Изображения для анимации врага
  enemyImg.back = loadAnimation("sprites/Creep/Back/Creep_B_f00.png", "sprites/Creep/Back/Creep_B_f05.png");
  enemyImg.front = loadAnimation("sprites/Creep/Front/Creep_F_f00.png", "sprites/Creep/Front/Creep_F_f05.png");
  enemyImg.left = loadAnimation("sprites/Creep/Left/Creep_L_f00.png", "sprites/Creep/Left/Creep_L_f05.png");
  enemyImg.right = loadAnimation("sprites/Creep/Right/Creep_R_f00.png", "sprites/Creep/Right/Creep_R_f05.png");
}
/*----------------------------------------------------------------------------*/


function setup() {
  let canvas = createCanvas(680, 520);
  canvas.parent('game');
  // w = width / cols;
  w = 40;

  greenField = new Group();
  wall = new Group();
  bricks = new Group();
  createScene();

  // Бомбермен. Создание. Анимация. Размер. Коллайдер. Движение.
  bomberman = createSprite(w * 1.5, w * 1.5, w, w);
  bomberman.addAnimation("back", bombermanImg.back);
  bomberman.addAnimation("front", bombermanImg.front);
  bomberman.addAnimation("left", bombermanImg.left);
  bomberman.addAnimation("right", bombermanImg.right);
  bomberman.setCollider("rectangle", 0, 8, w * 1.1, w * 2);
  bomberman.scale = w / 100;

  // Бомба


  // Враг. Создание. Анимация. Размер.
  // Чтобы поместить врагов в свободные от кирпичей ячейки - соберём координаты
  // этих ячеек в массив

  let positionOnGrassWithoutBricks = [];
  for (element of greenField) {
    if (!element.coveredByBrick) {
      positionOnGrassWithoutBricks.push(element.position);
    }
  }

  enemies = new Group();
  for (let i = 0; i < 10; i++) {
    let freeRandomPosition = floor(random(positionOnGrassWithoutBricks.length));
    let x = positionOnGrassWithoutBricks[freeRandomPosition].x;
    let y = positionOnGrassWithoutBricks[freeRandomPosition].y;
    let enemy = createSprite(x, y, w, w);

    enemy.addAnimation("back", enemyImg.back);
    enemy.addAnimation("front", enemyImg.front);
    enemy.addAnimation("left", enemyImg.left);
    enemy.addAnimation("right", enemyImg.right);

    enemy.scale = w / 70;
    enemy.setCollider("rectangle", 0, 0, wall[0].width, wall[0].height);

    if (random(10) >= 5) {
      enemy.velocity.x = random(10) >= 5 ? -1 : 1;
    } else {
      enemy.velocity.y = random(10) >= 5 ? -1 : 1;
    }

    enemies.add(enemy);
  }


  // Указываем слои для отображения спрайтов
  bomberman.depth = 2;
  for (element of greenField) {
    element.depth = 1;
  }

  for (element of wall) {
    element.depth = 1;
  }

}


function draw() {
  bombermanWalkFunction();
  bomberman.collide(wall);
  bomberman.collide(bricks);

  enemies.collide(wall, enemyChangeDirection);
  enemies.collide(bricks, enemyChangeDirection);

  drawSprites();
}


/*------------------- Функция для создания игрового поля ---------------------*/
function createScene() {
  let x = w / 2;
  let y = w / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {

      let element = createSprite(x, y, w, w);

      if ((i === 0 || i === rows - 1) ||
        (j === 0 || j === cols - 1) ||
        (i % 2 === 0 && j % 2 === 0)) {
        element.addImage(stoneImg);
        element.scale = w / element.width;
        wall.add(element);
      } else {
        element.addImage(grassImg);
        element.scale = w / element.width;

        if (random(10) >= 8 && i !== 1 && i !== 2 && j !== 1) {
          let elementB = createSprite(x, y, w, w);
          elementB.addImage(brickImg);
          elementB.scale = w / elementB.width;
          bricks.add(elementB);
          element.coveredByBrick = true;
        } else {
          element.coveredByBrick = false;
        }

        greenField.add(element);

      }
      x += w;
    }
    x = w / 2;
    y += w;
  }
}
/*----------------------------------------------------------------------------*/



/*--------------- Функция для управления и анимации бомбермена ---------------*/
function bombermanWalkFunction() {

  let velocity = 2;
  bomberman.animation.play();
  bomberman.animation.frameDelay = 2;

  if (keyDown(UP_ARROW)) {
    bomberman.changeAnimation("back");
    bomberman.setVelocity(0, -velocity);
  }

  if (keyDown(DOWN_ARROW)) {
    bomberman.changeAnimation("front");
    bomberman.setVelocity(0, velocity);
  }

  if (keyDown(LEFT_ARROW)) {
    bomberman.changeAnimation("left");
    bomberman.setVelocity(-velocity, 0);
  }

  if (keyDown(RIGHT_ARROW)) {
    bomberman.changeAnimation("right");
    bomberman.setVelocity(velocity, 0);
  }

  if (!keyIsPressed) {
    bomberman.animation.stop();
    bomberman.setVelocity(0, 0);
  }

}
/*----------------------------------------------------------------------------*/


/*------------------- Класс для объекта бомба  -------------------------------*/
function BombClass() {
  this.x = bomberman.position.x;
  this.y = bomberman.position.y;
  this.timer = frameCount;

  this.setUp = function() {
    this.bomb = createSprite(this.x, this.y);
    this.bomb.addAnimation("burnin", bombImg.burning);
    this.bomb.scale = w / this.bomb.width;
    this.bomb.life = 100;
  }

  this.explosion = function() {
    if (frameCount - this.timer > 100) {
      this.top = createSprite(this.x, this.y);
      this.top.addAnimation("top", bombImg.explosion);
      this.top.life = 100;

      this.right = createSprite(this.x + w, this.y);
      this.right.addAnimation("right", bombImg.explosion);
      this.right.rotation = 90;
      this.right.life = 100

      this.timer = frameCount;
    }

  }

}
/*----------------------------------------------------------------------------*/


/*------------------ Движение врагов ------------------------------------*/
function enemyChangeDirection() {
  if (this.velocity.x !== 0) {
    this.velocity.x = 0;
    this.velocity.y = random(10) >= 5 ? -1 : 1;
  } else if (this.velocity.y !== 0) {
    this.velocity.x = random(10) >= 5 ? -1 : 1;
    this.velocity.y = 0;
  }

  // Поворот спрайта
  if (this.velocity.x > 0) {
    this.changeAnimation("right");
  } else if (this.velocity.x < 0) {
    this.changeAnimation("left");
  }

  if (this.velocity.y > 0) {
    this.changeAnimation("front");
  } else if (this.velocity.y < 0) {
    this.changeAnimation("back");
  }

}





/*----------------------------------------------------------------------------*/