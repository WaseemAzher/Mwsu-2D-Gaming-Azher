var SpaceHipster = SpaceHipster || {};

//title screen
SpaceHipster.MainMenu = function(){};

SpaceHipster.MainMenu.prototype = {
  init: function(score) {
    var score = score || 0;
    this.highestScore = this.highestScore || 0;

    this.highestScore = Math.max(score, this.highestScore);
   },
  create: function() {
  	//show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    
    //give it speed in x
    this.background.autoScroll(-20, 0);
	
	this.game.global={
		
		skillLevel:'easy'
	};

    //start game text
  /*  var text = "Tap to begin";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5); */

    //highest score
    text = "Highest score: "+this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "bottom" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2 +200, text, style);
	t.anchor.set(0.5);
	
	
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
    h.anchor.set(0.5);
	
	var text = "Choose Difficulty";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2 - 150, text, style);
    t.anchor.set(0.5);
	
	
	var easybutton = this.game.add.button(this.game.width/2 - 100, this.game.height/2 - 100, 'easy', this.level, this);
    var mediumbutton = this.game.add.button(this.game.width/2 - 100, this.game.height/2 +10, 'medium', this.level, this);
    var hardbutton = this.game.add.button(this.game.width/2 - 100, this.game.height/2 + 100, 'hard', this.level, this);
	
	
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('Game');
    }
  },
  
  level: function(skillLevel) {
    if(skillLevel.key == 'easy' ) {
      this.game.global.skillLevel = 'easy';
      this.game.state.start('Game');
    }
    if(skillLevel.key == 'medium' ) {
      this.game.global.skillLevel = 'medium';
      this.game.state.start('Game');
    }
    if(skillLevel.key == 'hard' ) {
      this.game.global.skillLevel = 'hard';
      this.game.state.start('Game');
    }
  }
  
};