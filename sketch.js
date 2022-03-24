var bg, bgImg
var player, shooterImg, shooter_shooting

var zombie, zombieImg, zombieGroup

var heart1, heart2, heart3
var heart1Img, heart2Img, heart3Img

var bullet, bulletGroup
var bullets = 70

var gameState = 'fight'

var btnReset

var life = 3

var score = 0

var explosion, lose, win

function preload() {
  //imagens
  heart1Img = loadImage('assets/heart_1.png')
  heart2Img = loadImage('assets/heart_2.png')
  heart3Img = loadImage('assets/heart_3.png')

  shooterImg = loadImage('assets/shooter_2.png')
  shooter_shooting = loadImage('assets/shooter_3.png')

  zombieImg = loadImage('assets/zombie.png')

  bgImg = loadImage('assets/bg.jpeg')

  //sons
  explosion = loadSound('assets/explosion.mp3')
  lose = loadSound('assets/lose.mp3')
  win = loadSound('assets/win.mp3')
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  //adicionando a imagem de fundo
  // bg = createSprite(windowWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  // bg.addImage(bgImg)
  // bg.scale = 1.1

  //criando sprites para representar vidas restantes
  heart1 = createSprite(windowWidth - 150, 40, 20, 20)
  heart1.visible = false
  heart1.addImage('heart1', heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(windowWidth - 100, 40, 20, 20)
  heart2.visible = false
  heart2.addImage('heart2', heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(windowWidth - 150, 40, 20, 20)
  heart3.addImage('heart3', heart3Img)
  heart3.scale = 0.4

  // botão de reset
  btnReset = createImg('assets/reset.png')
  btnReset.position(30, 30)
  btnReset.size(60, 60)
  btnReset.mouseClicked(reset)

  createPlayer()

  //criando grupos de zumbis e balas
  bulletGroup = new Group()
  zombieGroup = new Group()
}

function draw() {
  background(bgImg)

  if (gameState === 'fight') {
    //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques
    if (keyDown('UP_ARROW') || touches.length > 0) {
      player.y = player.y - 30
    }
    if (keyDown('DOWN_ARROW') || touches.length > 0) {
      player.y = player.y + 30
    }
    if (keyDown('LEFT_ARROW') || touches.length > 0) {
      player.x -= 30
    }
    if (keyDown('RIGHT_ARROW') || touches.length > 0) {
      player.x += 30
    }

    if (life === 3) {
      heart1.visible = false
      heart2.visible = false
      heart3.visible = true
    } else if (life === 2) {
      heart1.visible = false
      heart2.visible = true
      heart3.visible = false
    } else if (life === 1) {
      heart1.visible = true
      heart2.visible = false
      heart3.visible = false
    } else if (life === 0) {
      heart1.visible = false
      gameState = 'lost'
    }

    //solte balas e mude a imagem do atirador para a posição de tiro quando a tecla de espaço for pressionada
    if (keyWentDown('space')) {
      player.addImage(shooter_shooting)

      explosion.play()

      bullet = createSprite(player.x, player.y - 25, 10, 5)
      bullet.shapeColor = rgb(160, 82, 45)
      bullet.velocityX = 20
      bulletGroup.add(bullet)
      bullets = bullets - 1
    }

    //o jogador volta à imagem original quando pararmos de pressionar a barra de espaço
    else if (keyWentUp('space')) {
      player.addImage(shooterImg)
    }

    //vá para gameState "bullet" quando o jogador ficar sem balas
    if (bullets == 0) {
      gameState = 'bullet'
    }

    if (score === 250) {
      gameState = 'won'
    }

    //destrua o zumbi quando a bala atingir
    if (zombieGroup.isTouching(bulletGroup)) {
      for (var i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(bulletGroup)) {
          zombieGroup[i].destroy()
          bulletGroup.destroyEach()
          score += 5
        }
      }
    }

    //destrua o zumbi qunado o jogador tocar
    if (zombieGroup.isTouching(player)) {
      for (var i = 0; i < zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(player)) {
          zombieGroup[i].destroy()
          life--
        }
      }
    }

    //chame a função para gerar zumbis
    enemy()
  }

  drawSprites()
  //textos
  textSize(45)
  fill(255)
  stroke(0)
  strokeWeight(2)
  // posX = mouseX
  // posY = mouseY
  // text(posX + ', ' + posY, mouseX, mouseY)
  text('Score: ' + score, windowWidth - 250, 110)
  text('Bullets: ' + bullets, windowWidth - 250, 170)

  //destrua o zumbi e o jogador e exiba uma mensagem em gameState "lost"
  if (gameState == 'lost') {
    textSize(100)
    fill('red')
    stroke(0)
    strokeWeight(2)
    text('Você Perdeu!', 400, windowHeight / 2)
    zombieGroup.destroyEach()
    player.destroy()
    lose.play()
  }

  //destrua o zumbi e o jogador e exiba uma mensagem em gameState "won"
  else if (gameState == 'won') {
    textSize(100)
    fill('yellow')

    text('Você Venceu', 400, 400)
    zombieGroup.destroyEach()
    player.destroy()
    win.play()
  }

  //destrua o zumbi, o jogador e as balas e exiba uma mensagem no gameState "bullet"
  else if (gameState == 'bullet') {
    textSize(50)
    fill('yellow')
    text('Você não tem mais balas!', 470, 410)
    zombieGroup.destroyEach()
    player.destroy()
    bulletGroup.destroyEach()
    lose.play()
  }
}

//criando função para gerar zumbis
function enemy() {
  if (frameCount % 50 === 0) {
    //dando posições x e y aleatórias para o zumbi aparecer
    zombie = createSprite(random(1100, 1500), random(430, 600), 40, 40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = Math.round(random(-1, -10))
    zombie.debug = true
    zombie.setCollider('rectangle', 0, 0, 350, 1000)

    zombie.lifetime = 400
    zombieGroup.add(zombie)
  }
}

//função para criar o sprite do jogador
function createPlayer() {
  player = createSprite(windowWidth - 1150, windowHeight - 300, 50, 50)
  player.addImage(shooterImg)
  player.scale = 0.3
  player.debug = true
  player.setCollider('rectangle', 0, 0, 300, 300)
}

//Função de reset
function reset() {
  gameState = 'fight'
  createPlayer()
  life = 3
  score = 0
  bullets = 70
}
