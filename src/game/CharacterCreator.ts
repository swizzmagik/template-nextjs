import { Scene } from "phaser";

interface CharacterParts {
    body?: string;
    eyes_left?: string;
    eyes_right?: string;
    hair?: string;
    faceHair?: string;
    clothes?: string;
    pants?: string;
    helmet?: string;
    armor?: string;
    weapon?: string;
    back?: string;
}

export class CharacterCreator {
    private scene: Scene;
    private x: number;
    private y: number;
    private scale: number;
    private depth: number = 0;

    // Container to hold all character parts
    private container: Phaser.GameObjects.Container;

    // Individual sprite parts with proper layering
    private parts: { [key: string]: Phaser.GameObjects.Sprite } = {};

    // Sprite offsets and depths based on SPUM's structure
    private partConfig = {
        back: {
            x: -200,
            y: -8,
            depth: 0,
            frame: 0,
        },
        body: {
            x: 0,
            y: 0,
            depth: 1,
            frame: 0, // Body frame
        },
        pants: {
            x: 100,
            y: 6,
            depth: 2,
            frame: 0, // Legs frame
        },
        clothes: {
            x: 50,
            y: -6,
            depth: 3,
            frame: 1, // Torso frame
        },
        armor: {
            x: 200,
            y: -6,
            depth: 4,
            frame: 1, // Chest frame
        },
        eyes_left: {
            x: 0,
            y: -12,
            depth: 5,
            frame: 2, // Face frame
        },
        eyes_right: {
            x: 10,
            y: -12,
            depth: 5,
            frame: 2, // Face frame
        },
        faceHair: {
            x: 0,
            y: 0,
            depth: 6,
            frame: 2, // Face accessories frame
        },
        hair: {
            x: 0,
            y: -84,
            depth: 7,
            frame: 2, // Head frame
        },
        helmet: {
            x: 0,
            y: -115,
            depth: 8,
            frame: 2, // Head accessories frame
        },
        weapon: {
            x: -112,
            y: -4,
            depth: 9,
            frame: 3, // Equipment frame
        },
    };

    constructor(scene: Scene, x: number, y: number, scale: number = 4) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scale = scale;

        // Create a container with depth sorting
        this.container = scene.add.container(x, y);
        this.container.setDepth(this.depth);
    }

    // Create or update a character with the given parts
    updateCharacter(parts: CharacterParts) {
        // Layer order based on depth
        const layerOrder = Object.keys(this.partConfig).sort(
            (a, b) =>
                this.partConfig[a as keyof typeof this.partConfig].depth -
                this.partConfig[b as keyof typeof this.partConfig].depth
        );

        // Update each part
        layerOrder.forEach((layer) => {
            const partKey = parts[layer as keyof CharacterParts];
            if (partKey) {
                this.updatePart(layer, partKey);
            }
        });
    }

    private updatePart(layer: string, spriteKey: string) {
        // Remove existing part if it exists
        if (this.parts[layer]) {
            this.parts[layer].destroy();
        }

        const config = this.partConfig[layer as keyof typeof this.partConfig];

        // Create new sprite for this part with proper configuration
        const sprite = this.scene.add.sprite(config.x, config.y, spriteKey);
        sprite.setScale(this.scale);
        sprite.setDepth(config.depth);

        // Set the specific frame if the sprite is a spritesheet
        if (sprite.texture.frameTotal > 1) {
            sprite.setFrame(config.frame);
        }

        // Add to container maintaining depth order
        this.container.add(sprite);
        this.parts[layer] = sprite;

        // Sort container children by depth
        this.container.sort("depth");
    }

    // Change a specific part
    changePart(layer: keyof CharacterParts, spriteKey: string) {
        this.updatePart(layer, spriteKey);
    }

    // Get the container for animation purposes
    getContainer() {
        return this.container;
    }

    // Set the character's position
    setPosition(x: number, y: number) {
        this.container.setPosition(x, y);
    }

    // Set the character's scale
    setScale(scale: number) {
        this.scale = scale;
        Object.values(this.parts).forEach((part) => {
            part.setScale(scale);
        });
    }

    // Flip the character horizontally
    setFlipX(flip: boolean) {
        Object.values(this.parts).forEach((part) => {
            part.setFlipX(flip);
            // Adjust x offset when flipped
            const layer = Object.keys(this.parts).find(
                (key) => this.parts[key] === part
            ) as keyof typeof this.partConfig;
            const config = this.partConfig[layer];
            part.x = flip ? -config.x : config.x;
        });
    }
}

