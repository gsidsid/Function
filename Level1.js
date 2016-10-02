var land;

var shadow;
var tank;
var turret;

var alive;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var player;

var logo;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 1000;
var nextFire = 0;
var game;

var logo;
var tank;
var button;
var modify;
var fl;
var ammo = 50;
var ammoleft = 50;
var bcounter = "Ammo: " + ammo;
var scaleRatio = window.devicePixelRatio / 3;

Game.Level1 = function(game){
    this.game = game;

};

Game.Level1.prototype = {







    create:function(){



        Phaser.ScaleManager.SHOW_ALL = 0;
        this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.refresh();

        this.stage.backgroundColor = '#3A5963';




        logo = g1.add.sprite(100,300,'logo');
        tanko = g1.add.sprite(1000,300,'tank');
        //var playbutton = g1.add.sprite(100, 500, 'enterworld');
        button = g1.add.button(100, 500, 'enterworld', loadWorld, this, 2, 1, 0);
        modify = g1.add.sprite(90, 660, 'modtank');

        g1.world.setBounds(0, 0, 1920, 1920);

    },
    update:function(){

        if(g1.touchControl != undefined) {
            var speed = g1.touchControl.speed;
            console.log(speed);
        }

        if(enemies != undefined) {

        g1.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

        enemiesAlive = 0;

        for (var i = 0; i < enemies.length; i++)
        {
            if (enemies[i].alive)
            {
                enemiesAlive++;
                g1.physics.arcade.collide(tank, enemies[i].tank);
                g1.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
                enemies[i].update();
            }
        }



        }



        if (cursors != undefined) {




        if (cursors.left.isDown || g1.input.keyboard.isDown(Phaser.Keyboard.A))
            {
                tank.angle -= 4;
            }
        else if (cursors.right.isDown || g1.input.keyboard.isDown(Phaser.Keyboard.D))
            {
                tank.angle += 4;
            }
        if (cursors.up.isDown || g1.input.keyboard.isDown(Phaser.Keyboard.W))
            {
                //  The speed we'll travel at
                currentSpeed = 300;
            }
        else
        {
            if (currentSpeed > 0)
            {
                currentSpeed -= 4;
            }
        }

        if (currentSpeed > 0)
        {
            g1.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
        }

        turret.rotation = g1.physics.arcade.angleToPointer(turret)-1.6;

        if (g1.input.activePointer.isDown)
        {
            fire();
            bcounter = bcounter.substring(0,5) + " " + ammoleft;
        }

        turret.x = tank.x;
        turret.y = tank.y;

        if(fl != undefined) {
            fl.x = turret.x;
            fl.y = turret.y;
        }
            g1.camera.follow(tank, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        }
    },
    render:function(){
        g1.debug.cameraInfo(g1.camera, 32, 32);

    },

}

function loadWorld () {
    //g1.load.bitmapFont('myfont', 'assets/mine.fnt');
    this.stage.backgroundColor = '#2A8963';
    g1.add.tileSprite(0, 0, 1920, 1920, 'bg');
    cursors = g1.input.keyboard.createCursorKeys();
    tanko.visible =! tanko.visible;
    tank = g1.add.sprite(1000,300,'tank');

    logo.visible =! logo.visible;
    button.visible =! button.visible;
    modify.visible =! modify.visible;

    tank.anchor.setTo(0.5, 0.5);

    turret = g1.add.sprite(tank.x, tank.y, 'turret');
    //tank.addChild(turret);
    turret.anchor.setTo(0.5, 0.3);

    tank.animations.add('move',['tank'],10,true);

    //turret.angle = -90;

    g1.camera.follow(tank);
    g1.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    g1.camera.focusOnXY(0, 0);



    g1.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.9);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    bullets = g1.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(ammo, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', -4.5);

    //player = g1.add.group();
    //player.add(tank);
    //player.add(turret);
    //tank.bringToTop();
    //turret.bringToTop();


    bmpText = g1.add.text(60, 875, bcounter, {
    font: "30px Verdana",
    fill: "#fff"
    });
    bmpText.fixedToCamera = true;



    enemyBullets = g1.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');

    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 3;
    enemiesAlive = 3;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets));
    }

        //tank.scale.setTo(scaleRatio, scaleRatio);
        //enemy.scale.setTo(scaleRatio, scaleRatio);
        logo.scale.setTo(scaleRatio, scaleRatio);
        bullet.scale.setTo(scaleRatio, scaleRatio);
        turret.scale.setTo(scaleRatio, scaleRatio);
        enterworld.scale.setTo(scaleRatio, scaleRatio);
        modtank.scale.setTo(scaleRatio, scaleRatio);
        muzzle.scale.setTo(scaleRatio, scaleRatio);

    g1.touchControl = g1.plugins.add(Phaser.Plugin.TouchControl);
    g1.game.touchControl.inputEnable();

}

function fire () {

    if (g1.time.now > nextFire && bullets.countDead() > 0)
    {
        ammoleft--;
        bmpText.setText("Ammo: " + ammoleft);

        nextFire = g1.time.now + fireRate;
        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = g1.physics.arcade.moveToPointer(bullet, 9000, g1.input.activePointer, 900)-1.6;

        g1.time.events.add(Phaser.Timer.SECOND * 0.1, flare, this);

        turret.bringToTop();
    }
}

function bulletHitPlayer (tank, bullet) {

    bullet.kill();

}

function bulletHitEnemy (tank, bullet) {

    bullet.kill();

    var destroyed = enemies[tank.name].damage();

    if (destroyed)
    {
        //var explosionAnimation = explosions.getFirstExists(false);
        //explosionAnimation.reset(tank.x, tank.y);
        //explosionAnimation.play('kaboom', 30, false, true);
    }

}

function flare() {
    fl = g1.add.sprite(turret.x,turret.y,'muzzle');
    fl.anchor.setTo(0.5,-11.5);
    fl.angle = turret.angle;
    g1.add.tween(fl).to( { alpha: 0 }, 20, Phaser.Easing.Linear.None, true);
}

    EnemyTank = function (index, game, player, bullets) {

        var x = g1.world.randomX;
        var y = g1.world.randomY;

        this.game = g1;
        this.health = 1;
        this.player = player;
        this.bullets = bullets;
        this.fireRate = 1000;
        this.nextFire = 0;
        this.alive = true;

        this.tank = g1.add.sprite(x, y, 'enemy', 'tank1');
        this.turret = g1.add.sprite(x, y, 'turret');

        this.tank.anchor.set(0.5);
        this.turret.anchor.set(0.5, 0.3);

        this.tank.name = index.toString();
        g1.physics.enable(this.tank, Phaser.Physics.ARCADE);
        this.tank.body.immovable = false;
        this.tank.body.collideWorldBounds = true;
        this.tank.body.bounce.setTo(1, 1);

        this.tank.angle = g1.rnd.angle();

        g1.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

    };

    EnemyTank.prototype.damage = function() {

        this.health -= 1;

        if (this.health <= 0)
        {
            this.alive = false;

            this.tank.kill();
            this.turret.kill();

            return true;
        }

        return false;

    }

    EnemyTank.prototype.update = function() {

        if(this.tank != undefined) {

        this.turret.x = this.tank.x;
        this.turret.y = this.tank.y;

        this.turret.rotation = g1.physics.arcade.angleBetween(this.tank, this.player)-1.6;

        if (g1.physics.arcade.distanceBetween(this.tank, this.player) < 800)
        {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
            {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();

                bullet.reset(this.turret.x, this.turret.y);

                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500)-1.6;
            }
        }
        }
    };
