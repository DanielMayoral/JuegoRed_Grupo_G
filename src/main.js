import PlayScene from './PlayScene.js';
import mainMenu
 from './mainMenu.js';
const config ={
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    input:{
        gamepad: true
    },
    physics:{
        default: 'arcade',
        arcade:{
            debug:false
        }
    },
    scene: [mainMenu, PlayScene]
};

var game = new Phaser.Game(config);
var widthGame = game.scale.width;
var heightGame = game.scale.height;

export {widthGame,heightGame};
