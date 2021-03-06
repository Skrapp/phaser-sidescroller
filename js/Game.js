var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

SideScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {
    this.map = this.game.add.tilemap('testing');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

    //create layers
      //this.map.addTilesetImage('backgroundLayer')
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    this.groundLayer = this.map.createLayer('Ground');
    this.dangerLayer = this.map.createLayer('Danger');
<<<<<<< HEAD
<<<<<<< HEAD
    //this.endLayer = this.map.createLayer('end');
            
      var a = this.game.physics.p2.convertCollisionObjects(this.map, "polygon")
=======
>>>>>>> parent of 5551c50... invisible enymy collision
=======
>>>>>>> parent of 5551c50... invisible enymy collision
    this.endLayer = this.map.createLayer('end');
      
    //collision on blockedLayer
   /* this.map.setCollisionBetween(1, 5000, true, this.groundLayer);
    this.map.setCollisionBetween(1, 5000, true, this.dangerLayer);
    this.map.setCollisionBetween(1, 5000, true, this.endLayer);*/
      
    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    //create coins
    this.createCoins();
    
    //create enemy  
    this.createEnemy(); 

    //create player
    this.player = this.game.add.sprite(100, 300, 'player');

    //enable physics on the player
    this.game.physics.p2.enable(this.player);

    //player gravity
    this.game.physics.p2.gravity.y = 1200;
    //this.player.body.gravity.y = 1200;
    this.player.body.fixedRotation = true;

    //properties when the player is ducked and standing, so we can use in update()
    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
   // this.player.standDimensions = {width: this.player.width, height: this.player.height};
    //this.player.anchor.setTo(0.5, 1);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //init game controller
    this.initGameController();

    //sounds
    this.coinSound = this.game.add.audio('coin');
  },
  
 //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that some images could be of different size as the tile size
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  createFromTiledObjectEnemy: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
      this.game.physics.p2.enable(sprite);
      sprite.body.gravity.y = 20;
      
      sprite.anchor.setTo(.5,.5);
      
      //walking 
      if (sprite['direction'] =='right'){
        console.log ('right');
        sprite.body.velocity.x = 20;}
      else if (sprite['direction'] =='left'){
        console.log ('left');
        sprite.scale.x *= -1;
        sprite.body.velocity.x = -20;}
      else {
        sprite.body.velocity.x = 0;}
  },  
  update: function() {
    //collision
    /*this.game.physics.arcade.collide(this.player, this.groundLayer, null, null, this);
      this.game.physics.arcade.collide(this.player, this.dangerLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    this.game.physics.arcade.collide(this.player, this.enemy, this.playerHit, null, this);  
     this.game.physics.arcade.collide(this.enemy, this.groundLayer, null, null, this);   
<<<<<<< HEAD
<<<<<<< HEAD
     this.game.physics.arcade.collide(this.enemy, this.enemyWalls, this.enemyTurn, null, this);*/ 

     this.game.physics.arcade.collide(this.enemy, this.endLayer, this.enemyTurn, null, this); 

=======
>>>>>>> parent of 5551c50... invisible enymy collision
=======
>>>>>>> parent of 5551c50... invisible enymy collision
     this.game.physics.arcade.collide(this.enemy, this.endLayer, this.enemyTurn, null, this); 
    
    //only respond to keys and keep the speed if the player is alive
    if(this.player.alive) {
        
      if(this.cursors.right.isDown) {
        this.player.body.velocity.x = 300;
      }
        else if (this.cursors.left.isDown) {
        this.player.body.velocity.x = -300;
      }
        else {
            this.player.body.velocity.x = 0;
        }
      if(this.cursors.up.isDown) {
        this.playerJump();
      }
        
      else if(this.cursors.down.isDown) {
        this.playerDuck();
      }
        

      if(!this.cursors.down.isDown && this.player.isDucked && !this.pressingDown) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }

      //restart the game if reaching the edge
      if(this.player.x >= this.game.world.width || this.player.y >= this.game.world.height) {
       // this.game.state.start('Game');
          this.game.time.events.add(1000, this.gameOver, this);
      }
        
    }
  },
  playerHit: function(player, groundLayer) {
    //if hits on the right side, die

     // console.log(player.body.blocked);

      //set to dead (this doesn't affect rendering)
      this.player.alive = false;

      //stop moving to the right
      this.player.body.velocity.x = 0;

      //change sprite image
      this.player.loadTexture('playerDead');

      //go to gameover after a few miliseconds
      this.game.time.events.add(1500, this.gameOver, this);
   // }
      
  },
    
  collect: function(player, collectable) {
    //play audio
    this.coinSound.play();

    //remove sprite
    collectable.destroy();
  },
  enemyTurn: function(enemy){
      console.log ('turn');
      enemy.scale.x *= -1;
      if (enemy['direction'] == 'left') {
          console.log ('right');
          enemy['direction'] = 'right';
          enemy.body.velocity.x = 20;
          //this.turnRight;
      }
      else if (enemy) {
          //console.log ('work')
          console.log ('left');
          enemy['direction'] = 'left';
          enemy.body.velocity.x = -20;
          //this.turnLeft;
      }
  },
  //turnRight: func
  initGameController: function() {

    if(!GameController.hasInitiated) {
      var that = this;
      
      GameController.init({
          left: {
              type: 'none',
          },
          right: {
              type: 'buttons',
              buttons: [
                false,
                {
                  label: 'J', 
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.playerJump();
                  }
                },
                false,
                {
                  label: 'D',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.pressingDown = true; that.playerDuck();
                  },
                  touchEnd: function(){
                    that.pressingDown = false;
                  }
                }
              ]
          },
      });
      GameController.hasInitiated = true;
    }

  },
  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'coins');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
    //create enemy
  createEnemy: function() {
    this.enemy = this.game.add.group();
    this.enemy.enableBody = true;
    var result = this.findObjectsByType('enemy', this.map, 'enemy');
    result.forEach(function(element){
      this.createFromTiledObjectEnemy(element, this.enemy);
    }, this);
  },
  gameOver: function() {
    this.game.state.start('Game');
  },
  playerJump: function() {
    if(this.player.body.blocked.down) {
      this.player.body.velocity.y -= 500;
    }    
  },
  playerDuck: function() {
      //change image and update the body size for the physics engine
      this.player.loadTexture('playerDuck');
      //this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
      
      //we use this to keep track whether it's ducked or not
      this.player.isDucked = true;
  },
  render: function()
    {
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");   
        this.game.debug.bodyInfo(this.player, 0, 80);   
    }
};