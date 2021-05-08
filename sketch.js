var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sheep, sheep_img;
var ground, invisibleGround, groundImage;

var obstaclesGroup, arrow

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  sheep_img = loadImage("sheep.PNG");
  
  groundImage = loadImage("ground2.png");
  
  arrow = loadImage("arrow.PNG");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1200, 500);
  
  sheep = createSprite(195,445,20,50);
  
  sheep.addImage(sheep_img);
  sheep.scale = 0.45;
  
  ground = createSprite(200,450,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(620,180);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(620,220);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,450,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  sheep.debug = true;
  background(255);
  textSize(25);
  text("Score: "+ score, 570,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
  
    if(keyDown("space") && sheep.y >= 159) {
      sheep.velocityY = -13;
    }
  
    sheep.velocityY = sheep.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    sheep.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(sheep)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    sheep.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);

    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(900,435,5,10);
    obstacle.debug = true;
    obstacle.velocityX = -(5 + 3*score/100);
    obstacle.addImage(arrow);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.20;
    obstacle.y = 400
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;

  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
}