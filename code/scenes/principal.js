class Principal extends Phaser.Scene {

    constructor(cursors, player) {
        super();

        this.cursors = cursors;
        this.player = player;
        this.laserGroup;
    }

    preload() {
        // Load game resources
        this.load.image('tiles', 'assets/sheet_7.png');
        this.load.spritesheet("characters", "assets/characters.png", { frameWidth: 32, frameHeight: 32 });
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/mapa.json');
        this.load.image('laser', "assets/fire.png");
    }

    create() {
        // 1st run to set everything in place
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, 800 * 2, 600 * 2);
        this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);

        const map = this.make.tilemap({ key: 'map' })
        const tileset = map.addTilesetImage('platformer', 'tiles');
        const platforms = map.createLayer('platforms', tileset, 0, 0);
        const water = map.createLayer('water', tileset, 0, 0);
        platforms.setCollisionByExclusion(-1, true);
        platforms.setScale(2);
        water.setScale(2);

        this.player = this.physics.add.sprite(100, 800, 'characters');
        this.player.setBounce(0.01);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        this.player.body.setGravityY(250)
        this.player.setScale(2);

        this.laserGroup = new LaserGroup(this);
		this.addEvents();

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: -1
        });

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        // Function used to update game assets like our character or to read the pressed keys
        this.player.anims.play('walk', true);
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