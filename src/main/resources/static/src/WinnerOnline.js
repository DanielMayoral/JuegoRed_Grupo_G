import { widthGame,heightGame } from './main.js';

export default class WinnerOnline extends Phaser.Scene{
    constructor(){
        super({key:'WinnerOnline'})
    }

    create(){
		var menumusic = this.scene.get('MusicScene');
		var musicjuego = this.scene.get('PlayOnline');
	 	this.add.image(0,0,'bckgroundGame').setOrigin(0,0);
	 	
        this.winner = this.registry.get("Ganador");
        this.ganador = this.make.text({
            x: widthGame/2,
            y: heightGame/2,
            text: 'Winner: '+ this.winner,
            style: {
                font: '12px catCafe',
                fill: '#ffffff'
            }
        });
        this.ganador.setOrigin(0.5,0.5);
        
        var backMain = this.add.image((widthGame/2)-100,(heightGame/4)*3,'backMain').setScale(0.5).setOrigin(0,0).setInteractive();
        
        if(this.controls === 'gamepad'){
            backMain.alpha = 0.5;
        
            var pointer = {x:backMain.x , y:backMain.y};
            this.input.gamepad.pad1.on('up',(index,value,button) =>{
                if(index === 0){
                    if(pointer.x === backMain.x && pointer.y === backMain.y){
                        this.scene.remove();
                        this.scene.start('mainMenu');

                		musicjuego.stopmusic();
                        menumusic.startMusic();
                    }
                }
                
            });
        }else{
            backMain.setInteractive();
            backMain.on('pointerdown',()=>{
                this.scene.start('mainMenu');

                musicjuego.stopmusic();
                menumusic.startMusic();
                this.scene.remove();
            });
        }
        
    }
}