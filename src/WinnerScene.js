import { heightGame, widthGame } from "./main.js";

export default class winnerScene extends Phaser.Scene{
    constructor(){
        super({key:'WinnerScene'});
    }

    preload(){
        this.load.image('backMain','assets/botones/botonMenu.png');
    }
    create(){

        this.add.image(0,0,'fondojuego').setOrigin(0,0).setScale(0.5);

        this.pointsP1 = this.registry.get('pointsP1');
        this.pointsP2 = this.registry.get('pointsP2');

        var winnerText = this.make.text({
            x:widthGame/2,
            y:100,
            text:'Ganador',
            style:{
                font:'32px monospace',
                fill:'#ffffff'
            }
        });
        winnerText.setOrigin(0.5,0.5).setDepth(0);

        var winner = this.make.text({
            x:widthGame/2,
            y:150,
            text:'',
            style:{
                font:'32px monospace',
                fill:'#ffffff'
            }
        });
        winner.setOrigin(0.5,0.5).setDepth(0);

        if(this.pointsP1 > this.pointsP2){
            winner.setText('Jugador Morado');
        }else if(this.pointsP1 < this.pointsP2){
            winner.setText('Jugador Verde');
        }else{
            winner.setText('Empate');
        }

        var backMain = this.add.image((widthGame/2)-100,(heightGame/4)*3,'backMain').setScale(0.5).setOrigin(0,0).setInteractive();

        var pointer = {x:backMain.x , y:backMain.y};
        this.input.gamepad.pad1.on('down',(index,value,button) =>{
            if(index === 0){
                if(pointer.x === backMain.x && pointer.y === backMain.y){
                    this.scene.remove();
                    this.scene.start('mainMenu');
                }
            }
            
        });

    }
}