
import InitGamepad from './InitGamepad.js';
import {widthGame, heightGame} from './main.js';

export default class OptionsScene extends Phaser.Scene{
    constructor(){
        super({key: 'OptionsScene'});
    }
    

    create(){

        this.add.image(0, 0, 'background').setOrigin(0, 0);


        this.controls = this.registry.get('controls');
        this.backButton = this.add.image(widthGame/2,heightGame/2+125,'backMain').setScale(0.5);
        
        var text = this.add.text(widthGame/2-100, heightGame/2, 'Controler', { font: '20px catCafe', fill: '#fff' });

        this.btnIzqda = this.add.image((widthGame/2)-50,(heightGame/2)+50,'flechaIzqda').setScale(0.15).setInteractive();
        this.btnDrcha = this.add.image((widthGame/2)+50,(heightGame/2)+50,'flechaDcha').setScale(0.15).setInteractive();
        var controlText = this.add.text(widthGame/2+20, heightGame/2, 'Mouse', { font: '20px catCafe', fill: '#fff' });

        if(this.controls === 'gamepad'){
            controlText.setText('Gamepad');
        }else{
            controlText.setText('Mouse')
        }

        this.btnIzqda.on('pointerdown',()=>{
            if(controlText.text === 'Gamepad'){
                controlText.setText('Mouse');
                this.controls = 'mouse';

            }
        });

        this.btnDrcha.on('pointerdown',()=>{
            if(controlText.text === 'Mouse'){
                if(this.input.gamepad.total === 0){
                    this.scene.stop();
                    this.scene.start('InitGamepad');
                }
                controlText.setText('Gamepad');
                this.controls = 'gamepad';
            }
            
            
        });

        
        
        if(this.controls === 'gamepad'){
            this.backButton.alpha = 0.5;
            var pointer = {x:this.backButton.x, y:this.backButton.y};

            this.input.gamepad.pad1.on('up',(index,value,button) =>{
                if(index === 0){
                    if(pointer.x === this.backButton.x){
                        this.registry.set('controls',this.controls);
                        this.scene.stop();
                        this.scene.start('mainMenu');
                    }
                }
            });
        }else{
            this.backButton.setInteractive();
            this.backButton.on('pointerdown',()=>{
                this.registry.set('controls',this.controls);
                this.scene.start('mainMenu');
                this.scene.stop();
            });
        }
        
    }

    update(){
    }

    initGamepad(){
        var win = this.add.zone(widthGame/2,heightGame/2,500,300).setInteractive().setOrigin(0);

        var demo = new InitGamepad();

        this.scene.add('InitGamepad',demo,true);
    }
}