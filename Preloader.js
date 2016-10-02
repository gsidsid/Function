var g1;
var scaleRatio = window.devicePixelRatio / 3;;

Game.Preloader = function(game){
    this.preloadBar = null;
    g1=game;
};

Game.Preloader.prototype = {
    preload:function(){
        this.preloadBar = this.add.sprite(this.world.centerX,
                                        this.world.centerY,'preloaderBar');
        this.preloadBar.anchor.setTo(0.5,0.5);
        this.time.advancedTiming - true;
        this.load.setPreloadSprite(this.preloadBar);

        Phaser.ScaleManager.SHOW_ALL = 0;
        this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.refresh();
        //ASSETS

        g1.load.image('tank', 'assets/tank.png');
        g1.load.image('enemy', 'assets/enemy.png');
        g1.load.image('logo', 'assets/logo.png');
        g1.load.image('bullet', 'assets/bullet.png');
        g1.load.image('turret', 'assets/turret.png');
        g1.load.image('enterworld', 'assets/enterworld.png');
        g1.load.image('modtank', 'assets/modtank.png');
        g1.load.image('muzzle', 'assets/muzzle.png');
        g1.load.image('bg', 'assets/debug-grid-1920x1920.png');

        tank.scale.setTo(scaleRatio, scaleRatio);
        enemy.scale.setTo(scaleRatio, scaleRatio);
        logo.scale.setTo(scaleRatio, scaleRatio);
        bullet.scale.setTo(scaleRatio, scaleRatio);
        turret.scale.setTo(scaleRatio, scaleRatio);
        enterworld.scale.setTo(scaleRatio, scaleRatio);
        modtank.scale.setTo(scaleRatio, scaleRatio);
        muzzle.scale.setTo(scaleRatio, scaleRatio);
        bg.scale.setTo(scaleRatio, scaleRatio);


    },



    create:function(){
        this.state.start('Level1');
    }

};
