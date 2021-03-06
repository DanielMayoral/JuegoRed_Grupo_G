import PlayScene from './PlayScene.js';
import mainMenu from './mainMenu.js';
import LoadScene from './LoadScene.js';
import OptionsScene from './OptionsScene.js';
import CreditsScene from './CreditsScene.js';
import NameScene from './NameScene.js';
import InitGamepad from './InitGamepad.js';
import PlayOnline from './PlayOnline.js';
import Lobby from './Lobby.js';
import MusicScene from './musicScene.js';


const config ={
    type: Phaser.AUTO,
    scale: {
		parent: "CoffeeTime",
		 width: 800,
    	height: 400,
},
   
    input:{
        gamepad: true
},
    dom: {
		createContainer: true
},
    physics:{
        default: 'arcade',
        arcade:{
            debug:false
        }
},
    scene: [LoadScene, NameScene, mainMenu, OptionsScene, InitGamepad, CreditsScene, PlayScene, Lobby,PlayOnline, MusicScene]
};

var game = new Phaser.Game(config);
var widthGame = game.scale.width;
var heightGame = game.scale.height;
var user = {
			nombreUsuario: "Guest"
		}

export {widthGame,heightGame, user};
