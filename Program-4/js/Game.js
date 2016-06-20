var SpaceHipster = SpaceHipster || {};

var fireButton;
var bullets;
var bulletTime=0;
var cursors;
var asteriods;


//title screen
SpaceHipster.Game = function(){};

SpaceHipster.Game.prototype = {
  create: function() {  
		  
  	//set world dimensions
    this.game.world.setBounds(0, 0, 1920, 1920);

    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');

    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(1.5);  

    //player initial score of zero
    this.playerScore = 0;

    //enable player physics
    this.game.physics.arcade.enable(this.player);
    this.playerSpeed = 120;
    this.player.body.drag.set(100);
    this.player.body.maxVelocity.set(200);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();

    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');    
    this.collectSound = this.game.add.audio('collect');
	
	//Generating Bullets
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.setAll('anchor.x', -0.2);
    this.bullets.setAll('anchor.y', 2);
	this.bullets.setAll('outOfBoundsKill',true);
	this.bullets.setAll('checkWorldBounds',true);
    this.bulletTime = 0;
	
	//Controls
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
  },
  update: function() {
    //Player Controls
        if (this.cursors.up.isDown)
        {
            this.game.physics.arcade.accelerationFromRotation(this.player.rotation, 200, this.player.body.acceleration);
        }
        else
        {
            this.player.body.acceleration.set(0);
        }
        if (this.cursors.left.isDown)
        {
            this.player.body.angularVelocity = -300;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.angularVelocity = 300;
        }
		
        else
        {
            this.player.body.angularVelocity = 0;
        }
        if (this.fireButton.isDown)
        {
			
            this.fireBullet();
        }
	
	
	
    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
    this.game.physics.arcade.collide(this.bullets, this.asteroids, this.destoryAsteroid, null, this);
    this.game.physics.arcade.collide(this.asteroids);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
	
	//Wrap-around for player and bullets
    this.screenWrap(this.player);
    this.bullets.forEachExists(this.screenWrap, this);
	
  },
  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
    }

  },
  
  
  generateAsteriods:function()
  {
	 this.asteroids = this.game.add.group();
	 //enable physics in them
     this.asteroids.enableBody = true; 
	 this.asteriods = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
	  	 
	  this.generateAsteriod();
	  
  },
  
  
  generateAsteriod: function() {
    
	var Min;
	var Max;

    var a =   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];    
    
    if (this.game.global.skillLevel == 'easy') {
      Min = 20;
      Max = 50;
    }

    if (this.game.global.skillLevel == 'medium') {
      Min = 50;
      Max = 150;
    }

    if (this.game.global.skillLevel == 'hard') {
      Min = 150;
      Max = 250;
    }
   

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(Min, Max) 

    //phaser's random number generator
    //var numAsteroids = this.game.rnd.integerInRange(150, 200)
    var asteriod;

    for (var i = 0; i < numAsteroids; i++) {	  
	  var modifier = this.game.rnd.weightedPick(a);                                        
      var rockGap = this.game.global.skillLevel * 75;                                         
      var spawn = {
      x: this.game.world.randomX,
	  y: this.game.world.randomY
	  };
      while ((spawn.x >= (this.game.world.centerX - rockGap) && spawn.x <= (this.game.world.centerX + rockGap)) &&
                                                                (spawn.y >= (this.game.world.centerY - rockGap) &&
                                                                spawn.y <= (this.game.world.centerY + rockGap))){
                                                                                spawn.x = this.game.world.randomX;
                                                                                spawn.y = this.game.world.randomY;
                                                                }
                                                               
      //once the spawn has been checked for being in the rock gap, create it
      asteriod = this.asteroids.create(spawn.x, spawn.y, 'rock');
                                           
      //scale the asteroid with respect to the weighted modifier
      asteriod.scale.setTo(modifier / 7);
                                               
      //set the velocity using the modifier so larger asteroids move slower
      asteriod.body.velocity.x = (100 / modifier) * this.game.rnd.integerInRange(-2, 2);
      asteriod.body.velocity.y = (100 / modifier) * this.game.rnd.integerInRange(-2, 2);
                                               
      //set world collision and bounce of the asteroid 
	  
	  
      asteriod.body.collideWorldBounds = true;
      asteriod.body.bounce.x = 1;
      asteriod.body.bounce.y = 1;
	  
	  
    }
	},
  
  
  
  hitAsteroid: function(player, asteroid) {
    //play explosion sound
    this.explosionSound.play();

    //make the player explode
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.player.kill();

    this.game.time.events.add(800, this.gameOver, this);
  },
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove sprite
    collectable.destroy();
  },
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  },
  
  fireBullet: function () {
        //Spaces between bullets
        if (this.game.time.now > this.bulletTime)
        {
            bullet = this.bullets.getFirstExists(false);
            
            if (bullet)
            {
                /* bullet.scale.setTo(0, 0);
                bullet.reset(this.player.body.x, this.player.body.y + 16);
                bullet.lifespan = 2000;
                bullet.rotation = this.player.rotation;
                this.game.physics.arcade.velocityFromRotation(this.player.rotation, 400, bullet.body.velocity);
                this.bulletTime = this.game.time.now + 50; */ 
				 /* 
				bullet.reset(this.player.body.x, this.player.body.y + 16);
				bullet.body.velocity.y= -400;
			 	bullet.lifespan = 2000;
			//	bullet.rotation = this.player.rotation;
				bulletTime=this.game.time.now+200;  */
				
				 /* bullet.reset(this.player.body.x + 16, this.player.body.y + 16);     
				 bullet.lifespan = 2000;  
				 bullet.rotation = this.player.rotation;   
                 bullet.body.velocity.y= -400;				 
                this.game.physics.arcade.velocityFromRotation(this.player.rotation, 400, bullet.body.velocity);
				 bulletTime = this.game.time.now + 50;  */
				
                
				bullet.rotation = this.player.rotation + Math.PI/2;
                var bs = this.bulletStart(40);
                bullet.reset(bs.dx, bs.dy);
                //this.bullet.angularVelocity = 300;
				bullet.body.velocity.y= -400;
                this.game.physics.arcade.velocityFromRotation(this.player.rotation, 700,bullet.body.velocity);
                bulletTime = this.game.time.now + 150;
				
				
               
            }
        }
    },
    
	
	bulletStart: function(d){
        return{
            "dx":this.player.x + d * Math.cos(this.player.body.angle),
            "dy":this.player.y + d * Math.sin(this.player.body.angle)
        }
    },
	
    screenWrap: function (sprite) {
        if (sprite.x < 0){
            sprite.x = this.game.world.bounds.width;
        }
        else if (sprite.x > this.game.world.bounds.width)
        {
            sprite.x = 0;
        }
        
        if (sprite.y < 0)
        {
            sprite.y = this.game.world.bounds.height;
        }
        else if (sprite.y > this.game.world.bounds.height)
        {
            sprite.y = 0;
        }
    },
  
  
    destoryAsteroid: function(bullet, asteroid){
        asteroid.kill();
        bullet.kill();
    },
  
  
  
  
  
};

/*
TODO
-audio
-asteriod bounch
*/