import { widthGame, heightGame } from "./main.js";

export default class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'PauseScene'});

        this.ancho = 500;
        this.alto = 300;
    }

    preload(){

    }

    create(){

        this.cameras.main.setViewport(widthGame/2-this.ancho/2, heightGame/2-this.alto/2, this.ancho, this.alto);

        this.textoPause = this.make.text({
            x: this.ancho/2,
            y: this.alto/2-50,
            text: 'Pause',
            style:{
                font: '32px monospace',
                fill: '#ffffff'
            }
        });
        this.textoPause.setOrigin(0.5,0.5);
        
        this.input.gamepad.pad1.on('up',(index,value,button) =>{
            if(index === 9){
                this.scene.wake('PlayScene');
                this.scene.remove('PauseScene');
            }
        });

        this.input.gamepad.pad3.on('up',(index,value,button) =>{
            if(index === 9){
                this.scene.wake('PlayScene');
                this.scene.remove('PauseScene');
            }
        });
    }
}