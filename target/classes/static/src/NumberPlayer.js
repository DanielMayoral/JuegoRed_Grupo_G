import { widthGame, heightGame } from "./main.js";
import NameScene from './NameScene.js';

export default class NumberPLayer extends Phaser.Scene{
    constructor(){
        super({key:'NumberPlayer'});
        this.width = 500;
        this.height = 300;
    }

    create(){
        this.music = this.sound.add('mainSound').setVolume(0.7).setLoop(true);
        this.music.play();

        this.cameras.main.setViewport(widthGame/2-this.width/2,heightGame/2-this.height/2, this.width, this.height);

        var singleButton = this.add.image((this.width/2)-100,(this.height/2)-100,'botonUnJugador').setScale(0.5).setOrigin(0,0);
        var multiButton = this.add.image((this.width/2)-100,(this.height/2)-50,'botonDosJugadores').setScale(0.5).setOrigin(0,0);
        var backButton = this.add.image((this.width/2)-100,(this.height/2),'backMain').setScale(0.5).setOrigin(0,0);

        singleButton.alpha = 0.5;
        var pointer = {x:singleButton.x , y:singleButton.y};
        this.input.gamepad.pad1.on('up',(index,value,button) =>{
            if(index === 0){
                if(pointer.y === singleButton.y){
                    this.music.stop();
                    //this.scene.start('PlayScene');
                    this.registry.set('gamemode','Singleplayer');
                    console.log("Single");
                    this.scene.start('PlayScene');
                    this.scene.stop('mainMenu');
                    this.scene.remove();
                }else if(pointer.y === multiButton.y){
                    this.music.stop();
                    this.registry.set('gamemode','Multiplayer');
                    console.log("Multi");
                    this.scene.start('PlayScene');
                    this.scene.stop('mainMenu');
                    this.scene.remove();
                }else if(pointer.y === backButton.y){
                    this.music.stop();
                    this.scene.start('mainMenu');
                    this.scene.remove();
                }
            }else if(index == 13){
                if(pointer.y === singleButton.y){
                    pointer.y = multiButton.y;
                    multiButton.alpha = 0.5;
                    singleButton.alpha = 1;
                }else if(pointer.y === multiButton.y){
                    pointer.y = backButton.y;
                    backButton.alpha = 0.5;
                    multiButton.alpha = 1;
                }else{
                    pointer.y = singleButton.y;
                    backButton.alpha = 1;
                    singleButton.alpha = 0.5;
                }
            }else if(index === 12){
                if(pointer.y === singleButton.y){
                    pointer.y = backButton.y;
                    backButton.alpha = 0.5;
                    singleButton.alpha = 1;
                }else if(pointer.y === multiButton.y){
                    pointer.y = singleButton.y;
                    singleButton.alpha = 0.5;
                    multiButton.alpha = 1;
                }else{
                    pointer.y = multiButton.y;
                    backButton.alpha = 1;
                    multiButton.alpha = 0.5;
                }
            }
            
        });
    }

    createWindow(){
        var win = this.add.zone(widthGame/2,heightGame/2,500,300).setInteractive().setOrigin(0);

        var demo = new NameScene();

        this.scene.add('NameScene',demo,true);
    }

}