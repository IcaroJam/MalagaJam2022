class Principal extends Phaser.Scene {

    constructor(cursors, player) {
        super();
        this.cursors = cursors;
        this.player = player;
    }

    preload() {
        this.load.image('tiles', 'assets/Untitled.png');
        this.load.spritesheet("characters", "assets/zombie.png", { frameWidth: 64, frameHeight: 128 });
        this.load.tilemapTiledJSON('map', 'assets/prueba_jam2.json');
    }

    create() {
        //this.cameras.main.zoom = 1
        const zoom = 2;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, 1280 * zoom, 1024 * zoom);
        this.physics.world.setBounds(0, 0, 1280 * zoom, 1024 * zoom);

        const map = this.make.tilemap({ key: 'map' })
        const tileset = map.addTilesetImage('terreno_nivel1', 'tiles');

        const platforms = map.createLayer('terreno', tileset, 0, 800);
        
        //const water = map.createLayer('water', tileset, 0, 0);

        platforms.setCollisionByExclusion(-1, true);
        platforms.setScale(1);
        //water.setScale(2);

        this.player = this.physics.add.sprite(100, 800, 'characters');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        this.player.body.setGravityY(150)
        this.player.setScale(1);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        this.player.anims.play('walk', true);
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
}

export default Principal;