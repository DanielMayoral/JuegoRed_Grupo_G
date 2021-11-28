import {widthGame, heightGame} from './main.js';

export default class OptionsScene extends Phaser.Scene{
    constructor(){
        super({key: 'OptionsScene'});
    }
    

    create(){
        //this.music = this.sound.add('mainSound').setVolume(0.7).setLoop(true);
        //this.music.play();

        var backButton = this.add.image(widthGame/2,heightGame/2-100,'backMain');
        backButton.alpha = 0.5;
        
        var pointer = {x:backButton.x, y:backButton.y};

        this.input.gamepad.pad1.on('up',(index,value,button) =>{
            if(index === 0){
                if(pointer.x === backButton.x){
                    //this.music.stop();
                    this.scene.stop();
                    this.scene.start('mainMenu');
                }
            }
        });
    }
}