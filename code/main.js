import Principal from "./scenes/principal.js";

var config = {
    type: Phaser.AUTO,
    parent: 'canvas',
    width: 800,
    height: 600,
    scene: Principal,
    physics: {
        default: "arcade"
    },
    pixelArt: true
};

var game = new Phaser.Game(config);
