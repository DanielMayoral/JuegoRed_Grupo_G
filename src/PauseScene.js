import { widthGame, heightGame } from "./main.js";

export default class PauseScene extends Phaser.Scene{
    constructor(){
        super({key: 'PauseScene'});

        this.width = 500;
        this.height = 300;
    }

    preload(){

    }

    create(){

        this.cameras.main.setViewport(widthGame/2-this.width/2, heightGame/2-this.height/2, this.width, this.height);

        this.input.gamepad.start();

        this.playScene = this.scene.get('PlayScene');

        var padP1 = this.registry.get('padP1');
        var padP2 = this.registry.get('padP2');

        
        //recives the index of the gamepad chosen in PlayScene
        //and reassigns the gamepad with the same index
        for(var i=0;i<this.input.gamepad.gamepads.length;i++){
            if(padP1.index === this.input.gamepad.gamepads[i].index){
                padP1 = this.input.gamepad.gamepads[i];
            }
        }

        for(var i=0;i<this.input.gamepad.gamepads.length;i++){
            if(padP2.index === this.input.gamepad.gamepads[i].index){
                padP2 = this.input.gamepad.gamepads[i];
            }
        }

        this.pauseText = this.make.text({
            x: this.width/2,
            y: this.height/2-50,
            text: 'Pause',
            style:{
                font: '32px monospace',
                fill: '#ffffff'
            }
        });
        this.pauseText.setOrigin(0.5,0.5);

        
        
        //resume PlayScene if player push up the start button of the gamepad
        padP1.on('up',(index,value,button) =>{
            if(index === 9){
                this.scene.wake('PlayScene');
                this.scene.remove('PauseScene');
            }
        });

        padP2.on('up',(index,value,button) =>{
            if(index === 9){
                this.scene.wake('PlayScene');
                this.scene.remove('PauseScene');
            }
        });

        
    }
}
