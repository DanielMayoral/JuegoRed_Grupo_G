import { heightGame, widthGame } from "./main.js";

export default class mainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'mainMenu'})
    }

    preload(){
        this.load.image('background','assets/fondomenuprincipal.png')
        this.load.image('start','assets/botones/botonEmpezar.png')
        this.load.audio('mprincipal', 'music/CLASSICA.wav')
        this.load.image('logomooncake', 'assets/logos/logomooncakejuego.png')
        this.load.image('logocoffee', 'assets/logos/logocoffeetimegame.png')
    }

    create(){
        this.add.image(0,0,'background').setScale(0.5).setOrigin(0,0);
        this.add.image(240,0, 'logocoffee').setOrigin(0,0);
        this.add.image(698,298, 'logomooncake').setOrigin(0,0);
        var music = this.sound.add('mprincipal', {volume: 0.3});
        music.setLoop(true);
        music.play();

        //button to go to PlayScene, that's the scen with the gameplay
        var startButton = this.add.image((widthGame/2)-100,(heightGame/4)*3,'start').setScale(0.5).setOrigin(0,0);
        //boton.setInteractive();
        //boton.on('pointerdown',()=>{this.scene.start('PlayScene')});
    
        this.input.gamepad.start();
        var pointer = {x:startButton.x , y:startButton.y};
        this.input.gamepad.pad1.on('down',(index,value,button) =>{
            if(index === 0){
                if(pointer.x === startButton.x && pointer.y === startButton.y){
                    music.stop();
                    this.scene.start('PlayScene');
                }
            }
            
        });
    }
}
