import Principal from "./scenes/principal.js";

var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        this.load.image('btStart', 'assets/start.png');
        this.load.image('btGameOver', 'assets/gameover.png');
    },

    create: function ()
    {
        console.log('%c Preloader ', 'background: green; color: white; display: block;');

        this.scene.start('mainmenu');
    }

});

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu' });
        window.MENU = this;
    },

    create: function ()
    {
        console.log('%c MainMenu ', 'background: green; color: white; display: block;');

        var bg = this.add.image(0, 0, 'btStart');

        //var container = this.add.container(100, 200, [ bg]);

        bg.setInteractive();

        bg.once('pointerup', function () {

            this.scene.start('principal');

        }, this);
    }

});


var config = {
    type: Phaser.AUTO,
    parent: 'canvas',
    width: 800,
    height: 600,
    scene: [ Preloader, MainMenu, Principal ],
    physics: {
        default: "arcade"
    },
    pixelArt: true
};

var game = new Phaser.Game(config);
