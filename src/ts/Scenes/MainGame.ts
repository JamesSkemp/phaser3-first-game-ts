import Utilities from "../Utilities";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";
	platforms: Phaser.Physics.Arcade.StaticGroup;

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
	}
}
