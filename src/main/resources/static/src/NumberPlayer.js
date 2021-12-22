import ConnectionMode from "./ConnectionMode.js";
import { widthGame, heightGame } from "./main.js";

export default class NumberPLayer extends Phaser.Scene{
    constructor(){
        super({key:'NumberPlayer'});
        this.width = 500;
        this.height = 300;
    }

    create(){
        this.controls = this.registry.get('controls');

        this.add.image(this.width/2, 0, 'menuPausa').setOrigin(0,0).setScale(1.2);

        var singleButton = this.add.image((this.width/2)+40,(this.height/2)-40,'botonUnJugador').setScale(0.5).setOrigin(0,0);
        var multiButton = this.add.image((this.width/2)+46,(this.height/2)+40,'botonDosJugadores').setScale(0.5).setOrigin(0,0);
        var backButton = this.add.image((this.width/2)+43,(this.height/2)+120,'backMain').setScale(0.5).setOrigin(0,0);

        if(this.controls === 'gamepad'){
            this.controlsGamepad(singleButton, multiButton, backButton);
        }else{
            singleButton.setInteractive();
            multiButton.setInteractive();
            backButton.setInteractive();

            singleButton.on('pointerdown',()=>{
                    this.registry.set('gamemode','Singleplayer');
                    this.scene.start('PlayScene');
                    this.scene.stop('MusicScene')
                    this.scene.stop('mainMenu');
                    this.scene.remove();
            });

            multiButton.on('pointerdown',()=>{
                this.createWindow();
            });

            backButton.on('pointerdown',()=>{
                this.scene.start('mainMenu');
                this.scene.remove();
            });
        }
        
    }

    controlsGamepad(singleButton, multiButton, backButton){
        singleButton.alpha = 0.5;
        var pointer = {x:singleButton.x , y:singleButton.y};
        this.input.gamepad.pad1.on('up',(index,value,button) =>{
            if(index === 0){
                if(pointer.y === singleButton.y){
                    //this.scene.start('PlayScene');
                    this.registry.set('gamemode','Singleplayer');
                    console.log("Single");
                    this.scene.start('PlayScene');
                    this.scene.stop('mainMenu');
                    this.scene.remove();
                }else if(pointer.y === multiButton.y){
                    this.createWindow();
                }else if(pointer.y === backButton.y){
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

        var demo = new ConnectionMode();

        this.scene.add('ConnectionMode',demo,true);
    }

}