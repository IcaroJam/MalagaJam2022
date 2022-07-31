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

var config = {
    type: Phaser.AUTO,
    parent: 'canvas',
    width: 1280,
    height: 1024,
    backgroundColor: '#202426',
    scene: [ Principal ],
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'canvas',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 1024
    },
    physics: {
        default: "arcade",
        arcade:{
            gravity:{y:2500}
        }
    },
    pixelArt: true,
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);
