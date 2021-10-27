import PlayScene from './PlayScene.js';
import menuPrincipal from './menuPrincipal.js';

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
            debug:true
        }
    },
    scene: [menuPrincipal,PlayScene]
};

var game = new Phaser.Game(config);
var widthGame = game.scale.width;
var heightGame = game.scale.height;

export {widthGame,heightGame};
