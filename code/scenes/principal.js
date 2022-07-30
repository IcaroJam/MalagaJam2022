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
        this.load.spritesheet("characters", "assets/main_walking.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("jump", "assets/main_jumping.png", { frameWidth: 128, frameHeight: 128 });
        // Mapa en formato JSON creado con Tiled
        this.load.tilemapTiledJSON('map', 'assets/nivel1.json');
        // Fondos
        this.load.image('fondo', 'assets/StaticBG1.png');
        this.load.image('montana', 'assets/DynamicBG1.png');

        //Laser
        this.load.image('laser', "assets/laser.png");

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
        this.player = this.physics.add.sprite(100, 1500, 'characters', 5).setSize(50, 128);
        this.player.setBounce(0.1);
        this.player.body.setGravityY(300)
        this.player.setScale(1);

        // Colisiones del jugador
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        // Laser
        this.laserGroup = new LaserGroup(this);
		this.addEvents();

        // Animación para andar
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump', { start: 3, end: 3}),
            frameRate: 10,
            repeat: 0
        });

        // La camera sigue al jugador
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        const velocity = 300;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-velocity);
            this.player.anims.play('walk', true);
            gameState.walking = true
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(velocity);
            this.player.anims.play('walk', true);
            gameState.walking = true
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop('walk');
            gameState.walking = false;
            gameState.sfx.steps.stop();
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-600);
        }

        if (this.cursors.up.isDown){
            this.player.anims.play('jump');
        }

        // Cae de forma pesada desde la plataformas
        if (this.player.body.velocity.y > -100) {
            console.log("me caigo");
            this.player.setVelocityY(600);
        }

        if (this.player.y < 1450) {
            this.player.setVelocityY(600);
        }

        if (gameState.walking && !gameState.sfx.steps.isPlaying && this.player.body.onFloor()) {
            gameState.sfx.steps.play();
        }

        if(!this.player.body.onFloor()){
            gameState.sfx.steps.stop();
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
 
		if (this.x <= 0) {
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