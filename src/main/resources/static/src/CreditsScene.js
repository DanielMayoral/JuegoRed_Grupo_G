import { widthGame, heightGame } from "./main.js";

export default class CreditsScene extends Phaser.Scene{
    constructor(){
        super({key: 'CreditsScene'});
    }

    create(){

        this.controls = this.registry.get('controls');
        var backButton = this.add.image(widthGame/2,heightGame/2+100,'backMain').setScale(0.5);;

        if(this.controls === 'gamepad'){
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
        }else{
            backButton.setInteractive();

            backButton.on('pointerdown',()=>{
                this.scene.start('mainMenu');
                this.scene.stop();
            });
        }
        

        var creditos = this.make.text({
            x:widthGame/2,
            y:50,
            text: 'CREDITS',
            style:{
                font:'45px catCafe',
                fill:'#ffffff'
            }
        });
        creditos.setOrigin(0.5,0.5);

        var developer = this.make.text({
            x:widthGame/2,
            y:120,
            text: 'Developed by:',
            style:{
                font:'30px catCafe',
                fill:'#ffffff'
            }
        });
        developer.setOrigin(0.5,0.5);

        var nameD1 = this.make.text({
            x:widthGame/2,
            y:150,
            text: 'Pablo Alvarez',
            style:{
                font:'30px catCafe',
                fill:'#ffffff'
            }
        });
        nameD1.setOrigin(0.5,0.5);

        var nameD2 = this.make.text({
            x:widthGame/2,
            y:185,
            text: 'Daniel Mayoral',
            style:{
                font:'30px catCafe',
                fill:'#ffffff'
            }
        });
        nameD2.setOrigin(0.5,0.5);

        var nameD3 = this.make.text({
            x:widthGame/2,
            y:220,
            text: 'Javier Picado',
            style:{
                font:'30px catCafe',
                fill:'#ffffff'
            }
        });
        nameD3.setOrigin(0.5,0.5);
    }
}