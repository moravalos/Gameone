window.addEventListener("load", function(){

    const canvas = document.getElementById("canvas-1");
    const ctx =  canvas.getContext("2d");
    /* ****************************Se le cambio lo largo del juego************************************ */
    canvas.width = 1500;
    /* **********************************************************l************************************ */
    canvas.height = 500;
    /* esta clase nos ayuda a controlar o manipular parte escencial del juego  */
    class InputHandler{
        constructor(game){
            this.game = game;
            window.addEventListener("keydown", e => {
                if((    (e.key === "ArrowUp") || (e.key === "ArrowDown")
                    ) && (this.game.keys.indexOf(e.key)  === -1)){
                    this.game.keys.push(e.key);
                } else if(e.key === ' '){
                    this.game.player.shootTop();
                }else if(e.key === 'd'){
                    this.game.debug = !this.game.debug;
                }
                console.log(this.game.keys);
            });

            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                console.log(this.game.keys);
            });

        }
    }

    /* declaramos la propiedades del proyectil*/
    class Projectile{
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            /* ****************************Se le Agrega tamaño al proyectil************************************ */
            this.width = 20; 
            this.height = 20;
            /* **********************************************************l************************************ */

            /* ****************************Se le Agrega velocidad a las veces disparadas************************************ */
            this.speed = 10;
            /* **********************************************************l************************************ */
            this.markedForDeletion = false;
        }

        update(){
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) {
                this.markedForDeletion = true;
            }
        }

        draw(context){
             /* ****************************Se cambio color al proyectil************************************ */           
            context.fillStyle = "purple";
            /* **********************************************************l************************************ */
            context.fillRect(this.x, this.y, this.width, this.height);
        }

        
    }
/* en esta clase colocamos las propiedades del jugador, estas nos ayudan a saber cuales son movimientos y le colocamos el proyectil*/
    class Player{
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.speedY = 0.5;
            this.maxSpeed = 5;
            this.projectiles = [];
            this.image = document.getElementById('player');
            this.maxFrame= 37;
        }
        /* validamos el movimiento de nuestro jugador, ya sea arriba o abajo */
        update(){
            this.y += this.speedY;
            if (this.game.keys.includes("ArrowUp")) {
             /* ****************************Se aumento la velocidad del jugador************************************ */           
                this.speedY = -3;
            } else if(this.game.keys.includes("ArrowDown")) {
                this.speedY = 3;
            } else {
                this.speedY = 0;
            }
            /* **********************************************************l************************************ */
            this.y += this.speedY;
            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            this.projectiles = this.projectiles.filter(projectile =>!projectile.markedForDeletion);
            if(this.frameX< this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }

        }

        draw(context){
            if(this.game.debug)context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                                this.frameX*this.width,
                                this.frameY*this.height,
                                this.width, this.height,
                                this.x, this.y, 
                                this.width, this.height
                                );
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
            
        }

        shootTop(){
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x+80, this.y+30));
                this.game.ammo--;
            }

        }

    }

    /* En esta clase declaramos las propiedades y funcionalidades que tiene el enemigo dentro de nuestro juego*/
    class Enemy{
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random()*-1.5-0.5;
            this.markedForDeletion = false;
             /* ****************************Se redujo el total de vidas del enemigo************************************ */           
            this.lives = 3;
            /* **********************************************************l************************************ */
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }

        update(){
            this.x += this.speedX;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX = 0;
            }
        }

        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, 
                                this.frameX*this.width,
                                this.frameY*this.height,
                                this.width, this.height,
                                this.x, this.y,
                                this.width, this.height
                                );
            context.font = "20px Helvetica";
            context.fillText(this.lives, this.x, this.y);
        }
    }
    /* creamos la clase eredada de enmigo, con este le damos propiedades a los enemigos que apareceran en nuestro juego*/ 
    class Angler1 extends Enemy {
        constructor(game){
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random()*3);

        }
    }

    class Layer{
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update(){
            if(this.x <= -this.width)this.x = 0;
            else this.x -= this.game.speed*this.speedModifier;
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }
    /* en esta clase agregamos la propiedades de nuestro fondo asi como tambien tomamos los id del html para agregar parte del layer*/
    class BackGround{
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById("layer1");
            this.image2 = document.getElementById("layer2");
            this.image3 = document.getElementById("layer3");
            this.image4 = document.getElementById("layer4");
            
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1.2);
            this.layer4 = new Layer(this.game, this.image4, 1.7);

            this.layers = [this.layer1, this.layer2, this.layer3];
        }

        update(){
            this.layers.forEach(layer=>layer.update());
        }

        draw(context){
            this.layers.forEach(layer=>layer.draw(context));
        }

    }
    /* en esta parte generamos la programacion necesaria y propiedades del juego, asi como tambien validamos si existe un ganador o un perdedor*/
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 30;
            this.fontFamily = "Helvetica";
            this.color = "white";
        }

        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = "black";
            context.font = this.fontSize + "px " + this.fontFamily;
            context.fillText("Score " + this.game.score, 20, 40);
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5*i,50,3,20);
            }
            const formattedTime = (this.game.gameTime*0.001).toFixed(1);
            context.fillText("Timer: " + formattedTime, 20, 100);
            if (this.game.gameOver) {
                context.textAlign = "center";
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore) {
                    message1 = "You won";
                    message2 = "Well done";
                } else {
                    message1 = "You lost";
                    message2 = "Try again! :(";
                }
                context.font = "50px " + this.fontFamily;
                context.fillText(   message1, 
                                    this.game.width*0.5, 
                                    this.game.height*0.5-20);
                context.font = "50px " + this.fontFamily;
                context.fillText(   message2,
                                    this.game.width*0.5,
                                    this.game.height*0.5+20);
            }
            
            context.restore();
        }
    }
    /* agregamos las propiedades de la interfzas y funcionamiento del juego  */
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.backGround = new BackGround(this);
            this.keys = [];
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 50;
            this.enemies = [];
            this.enemiesTimer = 0;
            this.enemiesInterval = 1000;
            this.gameOver = false;
            this.score = 0;
              /* ****************************Se aumento el puntaje del juego*********************************** */                      
            this.winningScore = 20;
              /* ******************************************************************************************** */                      
            this.gameTime = 0;
              /* ****************************Se eleva erl tiempo de juego************************************ */                      
            this.timeLimit = 60000;
              /* ******************************************************************************************** */                      
            this.speed = 5;
            this.debug = false;
        }
        /* colocamos el update como simonimo de cambio*/
        update(deltaTime){
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit) this.gameOver = true;
            this.backGround.update();
            this.backGround.layer4.update();
            this.player.update();
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) {
                    this.ammo++;
                    this.ammoTimer = 0;
                }
            } else {
                this.ammoTimer += deltaTime;
            }

            this.enemies.forEach(enemy =>{
                enemy.update();
                if (this.checkCollition(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                }
                this.player.projectiles.forEach(projectile =>{
                    if (this.checkCollition(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true; 
                            if(!this.gameOver)this.score += enemy.score;
                            if (this.score > this.winningScore)  {
                                this.gameOver = true;
                            }
                        }
                    }
                });
            });

            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);

            if (this.enemiesTimer > this.enemiesInterval && !this.gameOver) {
                this.addEnemy();
                this.enemiesTimer = 0;
            } else {
                this.enemiesTimer += deltaTime;
            }

        }

        draw(context){
            this.backGround.draw(context);
            this.player.draw(context);
            this.ui.draw(context);

            this.enemies.forEach(enemy =>{
                enemy.draw(context);
            });
            this.backGround.layer4.draw(context);
        }

        addEnemy(){
            this.enemies.push(new Angler1(this));
        }

        checkCollition(rect1, rect2){
            return(     rect1.x < rect2.x + rect2.width
                        && rect1.x + rect1.width > rect2.x
                        && rect1.y < rect2.y + rect2.height
                        && rect1.height + rect1.y > rect2.y
                );
        }

    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    /* colocamos el tiempo estimado */
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);
});