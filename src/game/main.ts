import { AUTO, Game } from "phaser";
import { Boot } from "./scenes/Boot";
import { CharacterPreview } from "./scenes/CharacterPreview";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    pixelArt: false,
    antialias: true,
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver, CharacterPreview],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;

