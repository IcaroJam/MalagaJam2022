import Principal from "./scenes/principal.js";

var config = {
    type: Phaser.AUTO,
    parent: 'canvas',
    width: 1280,
    height: 1024,
    scene: Principal,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'canvas',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 1024
    },
    physics: {
        default: "arcade"
    },
    pixelArt: true,
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);
