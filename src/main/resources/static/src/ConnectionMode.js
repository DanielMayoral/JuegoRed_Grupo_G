import { widthGame, heightGame } from "./main.js";

export default class ConnectionMode extends Phaser.Scene{
    constructor(){
        super({key:'ConnectionMode'});
        this.width = 500;
        this.height = 300;
    }

    create(){
        this.controls = this.registry.get('controls');

        this.cameras.main.setViewport(widthGame/2-this.width/2,heightGame/2-this.height/2, this.width, this.height);

        var offlineButton = this.add.image((this.width/2)-107,(this.height/2)-90,'botonOffline').setScale(0.5).setOrigin(0,0);
        var onlineButton = this.add.image((this.width/2)-106,(this.height/2)-10,'botonOnline').setScale(0.5).setOrigin(0,0);
        var backButton = this.add.image((this.width/2)-106,(this.height/2)+70,'backMain').setScale(0.5).setOrigin(0,0);

        if(this.controls === 'gamepad'){
            this.controlsGamepad(offlineButton, onlineButton, backButton);
        }else{
            offlineButton.setInteractive();
            onlineButton.setInteractive();
            backButton.setInteractive();

            offlineButton.on('pointerdown',()=>{
                    this.registry.set('gamemode','Multiplayer');
                    this.scene.start('PlayScene');
                    this.scene.stop('mainMenu');
                    this.scene.remove('NumberPlayer');
                    this.scene.remove();
            });

            onlineButton.on('pointerdown',()=>{
                this.scene.start('Lobby');
                this.scene.stop('mainMenu');
                this.scene.remove('NumberPlayer');
                this.scene.remove();
            });

            backButton.on('pointerdown',()=>{
                this.scene.start('mainMenu');
                this.scene.remove();
            });
        }
    }

    controlsGamepad(offlineButton, onlineButton, backButton){
        offlineButton.alpha = 0.5;
        var pointer = {x:offlineButton.x , y:offlineButton.y};
        this.input.gamepad.pad1.on('up',(index,value,button) =>{
            if(index === 0){
                if(pointer.y === offlineButton.y){;
                    this.registry.set('gamemode','Multiplayer');
                    this.scene.start('PlayScene');
                    this.scene.stop('MusicScene');
                    this.scene.stop('mainMenu');
                    this.scene.remove('NumberPlayer');
                    this.scene.remove();
                }else if(pointer.y === onlineButton.y){
                    this.scene.start('Lobby');
                    this.scene.stop('mainMenu');
                    this.scene.remove('NumberPlayer');
                    this.scene.remove();
                }else if(pointer.y === backButton.y){
                    this.scene.start('mainMenu');
                    this.scene.remove('NumberPlayer');
                    this.scene.remove();
                }
            }else if(index == 13){
                if(pointer.y === offlineButton.y){
                    pointer.y = onlineButton.y;
                    onlineButton.alpha = 0.5;
                    offlineButton.alpha = 1;
                }else if(pointer.y === onlineButton.y){
                    pointer.y = backButton.y;
                    backButton.alpha = 0.5;
                    onlineButton.alpha = 1;
                }else{
                    pointer.y = offlineButton.y;
                    backButton.alpha = 1;
                    offlineButton.alpha = 0.5;
                }
            }else if(index === 12){
                if(pointer.y === offlineButton.y){
                    pointer.y = backButton.y;
                    backButton.alpha = 0.5;
                    offlineButton.alpha = 1;
                }else if(pointer.y === onlineButton.y){
                    pointer.y = offlineButton.y;
                    offlineButton.alpha = 0.5;
                    onlineButton.alpha = 1;
                }else{
                    pointer.y = onlineButton.y;
                    backButton.alpha = 1;
                    onlineButton.alpha = 0.5;
                }
            }
            
        });
    }
}