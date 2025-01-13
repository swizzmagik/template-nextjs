import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.

        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image("background", "assets/bg.png");

        // Base path for SPUM assets
        const spumPath = "assets/svg/Resources/Addons/Legacy/0_Unit/0_Sprite";

        // Common sprite sheet config
        const spriteConfig = {
            frameWidth: 128,
            frameHeight: 128,
            spacing: 0,
            margin: 0,
        };

        // Load character parts as sprite sheets
        // Body (includes head, torso, arms, legs)
        this.load.spritesheet("body_human1", `${spumPath}/1_Body/Human_1.svg`, {
            ...spriteConfig,
            startFrame: 0,
            endFrame: 3,
        });

        // Left Eyes
        this.load.spritesheet("eyes_left", `${spumPath}/0_Eye/Eye0.svg`, {
            ...spriteConfig,
            startFrame: 0,
            endFrame: 1, // Eyes frames
        });

        // Right Eyes
        this.load.spritesheet("eyes_right", `${spumPath}/0_Eye/Eye0.svg`, {
            ...spriteConfig,
            startFrame: 0,
            endFrame: 1, // Eyes frames
        });

        // Hair
        this.load.spritesheet(
            "hair_default",
            `${spumPath}/1_Body/0_Hair/Hair_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 1, // Hair frames
            }
        );

        // Face Hair
        this.load.spritesheet(
            "facehair_default",
            `${spumPath}/1_FaceHair/FaceHair_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 1, // Face hair frames
            }
        );

        // Clothes
        this.load.spritesheet(
            "clothes_default",
            `${spumPath}/2_Cloth/Cloth_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 2, // Clothes frames (body, arms)
            }
        );

        // Pants
        this.load.spritesheet(
            "pants_default",
            `${spumPath}/3_Pant/Foot_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 1, // Pants frames
            }
        );

        // Helmet
        this.load.spritesheet(
            "helmet_default",
            `${spumPath}/4_Helmet/Helmet_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 1, // Helmet frames
            }
        );

        // Armor
        this.load.spritesheet(
            "armor_default",
            `${spumPath}/5_Armor/Armor_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 2, // Armor frames (body, arms)
            }
        );

        // Weapon
        this.load.spritesheet(
            "weapon_default",
            `${spumPath}/6_Weapons/0_Sword/Sword_1.svg`,
            {
                ...spriteConfig,
                startFrame: 0,
                endFrame: 1, // Weapon frames
            }
        );

        // Back item
        this.load.spritesheet("back_default", `${spumPath}/7_Back/Back_1.svg`, {
            ...spriteConfig,
            startFrame: 0,
            endFrame: 1, // Back item frames
        });
    }

    create() {
        // Start the character preview scene directly after loading assets
        this.scene.start("CharacterPreview");
    }
}

