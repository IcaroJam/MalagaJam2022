class Principal extends Phaser.Scene {

    constructor(cursors, player) {
        super();
        this.cursors = cursors;
        this.player = player;
        this.laserGroup;
    }

    preload() {
        // Tileset inicial de Nestor
        this.load.image('tiles', 'assets/Untitled.png');
        // Tileset de prueba
        this.load.spritesheet("characters", "assets/zombie.png", { frameWidth: 64, frameHeight: 128 });
        // Mapa en formato JSON creado con Tiled
        this.load.tilemapTiledJSON('map', 'assets/prueba_jam2.json');
        // Fondos
        this.load.image('fondo', 'assets/StaticBG1.png');
        this.load.image('montana', 'assets/DynamicBG1.png');
        this.load.image('laser', "assets/fire.png")
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
        this.player = this.physics.add.sprite(100, 800, 'characters');
        this.player.setBounce(0.1);
        this.player.body.setGravityY(150)
        this.player.setScale(1);

        this.laserGroup = new LaserGroup(this);
		this.addEvents();

        // Colisiones del jugador
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        // Animación para andar
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        // La camera sigue al jugador
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        const velocity = 200
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-240);
            this.player.anims.play('walk', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(240);
            this.player.anims.play('walk', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop('walk');
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-330);
        }
    }

    addEvents() {
	    this.input.on('pointerdown', pointer => {
            this.shootLaser();
        });
    }

    shootLaser() {
        this.laserGroup.fireLaser(this.player.x, this.player.y - 20);
    }
}

export default Principal;

class LaserGroup extends Phaser.Physics.Arcade.Group
{
	constructor(scene) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);

		// Initialize the group
		this.createMultiple({
			classType: Laser, // This is the class we create just below
			frameQuantity: 30, // Create 30 instances in the pool
			active: false,
			visible: false,
			key: 'laser'
		})
	}

    fireLaser(x, y) {
		// Get the first available sprite in the group
		const laser = this.getFirstDead(false);
		if (laser) {
			laser.fire(x, y);
		}
	}

}

class Laser extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'laser');
	}

    preUpdate(time, delta) {
		super.preUpdate(time, delta);
 
		if (this.y <= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

    fire(x, y) {
		this.body.reset(x, y);
 
		this.setActive(true);
		this.setVisible(true);
 
		this.setVelocityX(900);
	}
}