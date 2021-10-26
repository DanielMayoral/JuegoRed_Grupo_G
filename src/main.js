import PlayScene from './PlayScene.js';

const config ={
    type: Phaser.AUTO,
    width: 400,
    height: 800,
    input:{
        gamepad: true
    },
    physics:{
        default: 'arcade',
        arcade:{
            debug:true
        }
    },
    scene: [PlayScene]
};

var game = new Phaser.Game(config);
var widthGame = game.scale.width;
var heightGame = game.scale.height;

export {widthGame,heightGame};
