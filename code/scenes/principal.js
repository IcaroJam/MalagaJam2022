class Principal extends Phaser.Scene {

    constructor(cursors, player) {
        super();
        this.cursors = cursors;
        this.player = player;
    }

    preload() {
        // Tileset inicial de Nestor
        this.load.image('tiles', 'assets/Untitled.png');
        // Tileset de prueba
        this.load.spritesheet("characters", "assets/main_walking.png", { frameWidth: 128, frameHeight: 128 });
        // Mapa en formato JSON creado con Tiled
        this.load.tilemapTiledJSON('map', 'assets/nivel1.json');
        // Fondos
        this.load.image('fondo', 'assets/StaticBG1.png');
        this.load.image('montana', 'assets/DynamicBG1.png');
    }

    create() {
        // Asignacion de los cursores direccion
        this.cursors = this.input.keyboard.createCursorKeys();

        const zoom = 2;
        // Reajuste de las camaras y el mundo para el zoom * 2
        this.cameras.main.setBounds(0, 0, 1280 * zoom, 1024 * zoom);
        this.physics.world.setBounds(0, 0, 1280 * zoom, 1024 * zoom);

        this.add.image(1000, 1000, 'fondo').setScale(4);
        this.add.image(1000, 1500, 'montana').setScale(2);

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
        this.player = this.physics.add.sprite(100, 1500, 'characters', 5).setSize(50, 128);
        this.player.setBounce(0.1);
        this.player.body.setGravityY(300)
        this.player.setScale(1);

        // Colisiones del jugador
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        // Animación para andar
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // La camera sigue al jugador
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        const velocity = 300;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-velocity);
            this.player.anims.play('walk', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocity);
            this.player.anims.play('walk', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop('walk');
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-300);
        }

        if (this.player.y < 1650) {
            this.player.setVelocityY(250);
        }
    }
}

export default Principal;