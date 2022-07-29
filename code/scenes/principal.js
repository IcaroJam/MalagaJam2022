class Principal extends Phaser.Scene {

    constructor(cursors, player) {
        super();

        this.cursors = cursors;
        this.player = player;
    }

    preload() {

        this.load.image('tiles', 'assets/sheet_7.png');
        this.load.spritesheet("characters", "assets/characters.png", { frameWidth: 32, frameHeight: 32 });
        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/mapa.json');
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
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        this.player.body.setGravityY(150)
        this.player.setScale(2);

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