var gameState = {};

class Principal extends Phaser.Scene {

    constructor(cursors, player, steps) {
        super({key:"principal"});
        this.cursors = cursors;
        this.player = player;
    }

    preload() {
        // Tileset inicial de Nestor
        this.load.image('tiles', 'assets/BaseTileMap.png');
        // Tileset de prueba
        this.load.spritesheet("plychar", "assets/MainCharTile.png", { frameWidth: 128, frameHeight: 128 });
        // Mapa en formato JSON creado con Tiled
        this.load.tilemapTiledJSON('map', 'assets/nivel1.json');
        // Fondos
        this.load.image('mountains3', 'assets/Plane3Mountains.png');
        this.load.image('mountains2', 'assets/Plane2Mountains.png');
        this.load.image('mountains1', 'assets/Plane1Mountains.png');
        this.load.image('trees2', 'assets/Plane2Trees.png');
        this.load.image('trees1', 'assets/Plane1Trees.png');
        this.load.image('vignette', 'assets/Vignette.png');

        // Sounds
        this.load.audio('steps', [
            'assets/audio/steps-003.ogg',
        ]);
    }

    create() {
        // Asignacion de los cursores direccion
        this.cursors = this.input.keyboard.createCursorKeys();

        const zoom = 2;
        // Reajuste de las camaras y el mundo para el zoom * 2
        this.cameras.main.setBounds(0, 0, 7680 * zoom, 1024 * zoom);
        this.physics.world.setBounds(0, 0, 7680 * zoom, 1024 * zoom);

        gameState.walking = false;

        // Sound
        gameState.sfx = {};
        gameState.sfx.steps = this.sound.add('steps', { loop: true });

        this.add.image(0, 720, 'mountains3').setOrigin(0, 1).setScrollFactor(0.1);
        this.add.image(0, 900, 'mountains2').setOrigin(0, 0.8).setScrollFactor(0.2);
        this.add.image(0, 1080, 'mountains1').setOrigin(0, 0.6).setScrollFactor(0.4);
        this.add.image(0, 1180, 'trees2').setOrigin(0, 0.4).setScrollFactor(0.6);
        this.add.image(0, 1520, 'trees1').setOrigin(0, 0.2).setScrollFactor(1);
        

        // NOTA: Las llaves terreno_nivel1 (tileset) y terreno (layer) seasignan en Tiled
        // Creamos el mapa a traves del objeto de la configuración
        const map = this.make.tilemap({ key: 'map' })

        // Le asignamos su tileset para que lo pueda dibujar
        const tileset = map.addTilesetImage('terreno_nivel1', 'tiles');

        // Creamos una capa cargada desde la config del map
        const platforms = map.createLayer('terreno', tileset, 0, 800);
        platforms.setScale(1);

        // Importante para la colision
        platforms.setCollisionByExclusion(-1, true);

        // Añadimos al jugador
        this.player = this.physics.add.sprite(100, 1500, 'plychar', 5).setSize(50, 128);
        this.player.setBounce(0.1);
        this.player.setScale(1);

        // Colisiones del jugador
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        // Animación para andar
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('plychar', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('plychar', { start: 8, end: 9}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('plychar', { start: 5, end: 5}),
            frameRate: 10,
            repeat: 0
        });

        // Vignette setup.
        var vign = this.add.image(0, -200, 'vignette').setOrigin(0, 0).setScrollFactor(0);
        vign.alpha = 0.5;

        // La camera sigue al jugador
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        console.log(this.player.body.velocity.y)
        const velocity = 300;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-velocity);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
              }
            gameState.walking = true
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocity);
            if (this.player.body.onFloor()) {
                this.player.play('walk', true);
              }
            gameState.walking = true
        }
        else {
            this.player.setVelocityX(0);
            if(this.player.body.onFloor()){
                this.player.play('idle', true);
            }
            gameState.walking = false;
            gameState.sfx.steps.stop();
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-1200);
            this.player.anims.play('jump', true);
        }

        if (gameState.walking && !gameState.sfx.steps.isPlaying && this.player.body.onFloor()) {
            gameState.sfx.steps.play();
        }

        if(!this.player.body.onFloor()){
            gameState.sfx.steps.stop();
        }

        if (this.player.body.velocity.x > 0) {
            this.player.setFlipX(false);
          } else if (this.player.body.velocity.x < 0) {
            this.player.setFlipX(true);
          }
    }
}

export default Principal;