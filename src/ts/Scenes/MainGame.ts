import Utilities from "../Utilities";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";
	platforms: Phaser.Physics.Arcade.StaticGroup;
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	stars: Phaser.Physics.Arcade.Group;
	score = 0;
	scoreText: Phaser.GameObjects.Text;
	bombs;
	gameOver = false;

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainGame", "create");

		//this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "Phaser-Logo-Small");
		this.add.image(400, 300, 'sky');

		this.platforms = this.physics.add.staticGroup();

		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');

		this.player = this.physics.add.sprite(100, 450, 'dude');

		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		this.physics.add.collider(this.player, this.platforms);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
		});
		this.stars.children.iterate(function (child: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
		this.physics.add.collider(this.stars, this.platforms);

		this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

		// Note: Phaser tutorial has `fill` instead of `color`.
		this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });

		this.bombs = this.physics.add.group();

		this.physics.add.collider(this.bombs, this.platforms);
		this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
	}

	update(time: number, delta: number): void {
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-160);

			this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(160);

			this.player.anims.play('right', true);
		}
		else
		{
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330);
		}
	}

	collectStar (player, star)
	{
		star.disableBody(true, true);

		this.score += 10;
		this.scoreText.setText('Score: ' + this.score);

		if (this.stars.countActive(true) === 0)
		{
			this.stars.children.iterate(function (child: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
				child.enableBody(true, child.x, 0, true, true);
			});

			const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

			const bomb = this.bombs.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		}
	}

	hitBomb (player, bomb)
	{
		this.physics.pause();

		player.setTint(0xff0000);
		player.anims.play('turn');

		this.gameOver = true;
	}
}
