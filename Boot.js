var Game = {};

Game.Boot = function(game){

};

Game.Boot.prototype = {
    init:function(){
        this.input.maxPointers = 2;

        this.stage.disableVisibilityChange = true;
    },
    preload:function(){
        this.load.image('preloaderBar','assets/Menu.png');
    },
    create:function(){
        this.state.start('Preloader');
    }

};
