import { Scene } from "phaser";
import { CharacterCreator } from "../CharacterCreator";

export class CharacterPreview extends Scene {
    private character: CharacterCreator | null = null;

    constructor() {
        super("CharacterPreview");
    }

    create() {
        // Add background
        this.add.image(0, 0, "background").setOrigin(0, 0);

        // Create character in center of screen
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.character = new CharacterCreator(this, centerX, centerY, 2.5);

        // Initialize with default parts
        this.character.updateCharacter({
            body: "body_human1",
            eyes_left: "eyes_left",
            eyes_right: "eyes_right",
            hair: "hair_default",
            faceHair: "facehair_default",
            clothes: "clothes_default",
            pants: "pants_default",
            helmet: "helmet_default",
            armor: "armor_default",
            weapon: "weapon_default",
            back: "back_default",
        });

        // Add a gentle floating animation
        this.add.tween({
            targets: this.character.getContainer(),
            y: centerY + 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
        });
    }
}

