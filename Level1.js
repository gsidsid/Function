var myId=0;

var land;

var shadow;
var tank;
var turret;
var player;
var tanksList;
var explosions;

var logo;


var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;
var inputChanged = true;
var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();

	eurecaClient.ready(function (proxy) {
		eurecaServer = proxy;
	});


	//methods defined under "exports" namespace become available in the server side

	eurecaClient.exports.setId = function(id)
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
	}

	eurecaClient.exports.kill = function(id)
	{
		if (tanksList[id]) {
			tanksList[id].kill();
			console.log('killing ', id, tanksList[id]);
		}
	}

	eurecaClient.exports.spawnEnemy = function(i, x, y)
	{

		if (i == myId) return; //this is me

		console.log('SPAWN');
		var tnk = new Tank(i, game, tank);
		tanksList[i] = tnk;
	}

	eurecaClient.exports.updateState = function(id, state)
	{
		if (tanksList[id])  {
			tanksList[id].cursor = state;
			tanksList[id].tank.x = state.x;
			tanksList[id].tank.y = state.y;
			tanksList[id].tank.angle = state.angle;
			tanksList[id].turret.rotation = state.rot;
			tanksList[id].update();
		}
	}
}


Tank = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		fire:false
	}

	this.input = {
		left:false,
		right:false,
		up:false,
		fire:false
	}

    var x = 0;
    var y = 0;

    this.game = game;
    this.health = 30;
    this.player = player;
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);


	this.currentSpeed =0;
    this.fireRate = 500;
    this.nextFire = 0;
    this.alive = true;

    this.tank = game.add.sprite(x, y, 'tank');
    this.turret = game.add.sprite(x, y, 'turret');

    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.5, 0.3);

    this.tank.id = index;
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(0, 0);

    this.tank.angle = 0;

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity)-1.6;

};


function frswitch() {
    inputChanged =! inputChanged;
}
Tank.prototype.update = function() {

	inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up ||
		this.cursor.fire != this.input.fire
	);

	//setInterval(frswitch, 5);

	if (inputChanged)
	{
		//Handle input change here
		//send new values to the server
		if (this.tank.id == myId)
		{
			// send latest valid state to the server
			this.input.x = this.tank.x;
			this.input.y = this.tank.y;
			this.input.angle = this.tank.angle;
			this.input.rot = this.turret.rotation;


			eurecaServer.handleKeys(this.input);

		}
	}

	//cursor value is now updated by eurecaClient.exports.updateState method


    if (this.cursor.left)
    {
        this.tank.angle -= 4;
    }
    else if (this.cursor.right)
    {
        this.tank.angle += 4;
    }
    if (this.cursor.up)
    {
        //  The speed we'll travel at
        this.currentSpeed = 500;
    }
    else
    {
        if (this.currentSpeed > 0)
        {
            this.currentSpeed -= 20;
        }
    }
    if (this.cursor.fire)
    {
		this.fire({x:this.cursor.tx, y:this.cursor.ty});
    }



    if (this.currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
    }
	else
	{
		game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);
	}




    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
};


Tank.prototype.fire = function(target) {
		if (!this.alive) return;
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.turret.x, this.turret.y);

			bullet.rotation = this.game.physics.arcade.moveToObject(bullet, target, 1700)-1.6;
        }
}


Tank.prototype.kill = function() {
	this.alive = false;
	this.tank.kill();
	this.turret.kill();

}

var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio,window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'Function-Multi', { preload: preload, create: eurecaClientSetup, update: update, render: render });

 function preload() {
        this.preloadBar = this.add.sprite(this.world.centerX,
                                        this.world.centerY,'logo');
        this.preloadBar.anchor.setTo(0.5,0.5);
        this.time.advancedTiming = true;
        this.load.setPreloadSprite(this.preloadBar);

        Phaser.ScaleManager.SHOW_ALL = 0;
        this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;




        this.scale.refresh();
        //ASSETS

        game.load.image('tank', 'assets/tank.png');
        game.load.image('enemy', 'assets/enemy.png');
        game.load.image('logo', 'assets/logo.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('turret', 'assets/turret.png');
        game.load.image('enterworld', 'assets/enterworld.png');
        game.load.image('modtank', 'assets/modtank.png');
        game.load.image('muzzle', 'assets/muzzle.png');
        game.load.image('bg', 'assets/debug-grid-1920x1920.png');
        game.load.image('compass', 'assets/images/compass_rose.png');
        game.load.image('touch_segment', 'assets/images/touch_segment.png');
        game.load.image('touch', 'assets/images/touch.png');


        this.stage.backgroundColor = '#3A5963';

        game.world.setBounds(0, 0, 1920, 1920);
        scroll(0,2000);
        setTimeout(endLoad, 3000);

    }

function loadWorld() {
    logo.visible != logo.visible;
    tanko.visible != tanko.visible;
    button.visible != button.visible;
}

function endLoad() {
    scroll(0,0);
}

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);
	game.stage.disableVisibilityChange  = true;

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 1920, 1920, 'bg');
    land.fixedToCamera = true;

    tanksList = {};

	player = new Tank(myId, game, tank);
	tanksList[myId] = player;
	tank = player.tank;
	turret = player.turret;
	tank.x=0;
	tank.y=0;
	bullets = player.bullets;


    tank.bringToTop();
    turret.bringToTop();

    //logo = game.add.sprite(0, 200, 'logo');
    //logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

	setTimeout(removeLogo, 1000);

}

function removeLogo () {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
}

function update () {

	//do not update if client not ready
	if (!ready) return;

	player.input.left = cursors.left.isDown;
	player.input.right = cursors.right.isDown;
	player.input.up = cursors.up.isDown;
	player.input.fire = game.input.activePointer.isDown;
	player.input.tx = game.input.x+ game.camera.x;
	player.input.ty = game.input.y+ game.camera.y;



	turret.rotation = game.physics.arcade.angleToPointer(turret)-1.6;
    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;
    game.camera.follow(tank, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


    for (var i in tanksList)
    {
		if (!tanksList[i]) continue;
		var curBullets = tanksList[i].bullets;
		var curTank = tanksList[i].tank;
		for (var j in tanksList)
		{
			if (!tanksList[j]) continue;
			if (j!=i)
			{

				var targetTank = tanksList[j].tank;

				game.physics.arcade.overlap(curBullets, targetTank, bulletHitPlayer, null, this);

			}
			if (tanksList[j].alive)
			{
				tanksList[j].update();
			}
		}
    }
}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();
}

function render () {}

