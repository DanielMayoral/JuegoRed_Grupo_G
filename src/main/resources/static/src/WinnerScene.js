import { heightGame, widthGame } from "./main.js";

export default class winnerScene extends Phaser.Scene{
    constructor(){
        super({key:'WinnerScene'});
    }


    create(){
        this.add.image(0,0,'bckgroundGame').setOrigin(0,0).setScale(0.5);

        var backMain = this.add.image((widthGame/2)-100,(heightGame/4)*3,'backMain').setScale(0.5).setOrigin(0,0).setInteractive();
        backMain.alpha = 0.5;
        
        var pointer = {x:backMain.x , y:backMain.y};
        this.input.gamepad.pad1.on('up',(index,value,button) =>{
            if(index === 0){
                if(pointer.x === backMain.x && pointer.y === backMain.y){
                    this.scene.remove();
                    this.scene.start('mainMenu');
                }
            }
            
        });

        this.gameMode = this.registry.get('gamemode');

        if(this.gameMode === 'Singleplayer'){
            this.winnerSP();
        }else if(this.gameMode === 'Multiplayer'){
            this.winnerMP();
        }

    }

    winnerSP(){
        var nameP1 = this.registry.get('namePlayer1');
        var pointsP1 = this.registry.get('pointsP1');

        var pointsText = this.make.text({
            x:widthGame/2,
            y: 100,
            text:'Puntos '+nameP1+' : '+pointsP1,
            style:{
                font:'32px arial',
                fill:'#ffffff'
            }
        });
        pointsText.setOrigin(0.5,0.5);
    }

    winnerMP(){
        var nameP1 = this.registry.get('namePlayer1');
        var nameP2 = this.registry.get('namePlayer2');

        var pointsP1 = this.registry.get('pointsP1');
        var pointSP2 = this.registry.get('pointsP2');

        var winnerText = this.make.text({
            x:widthGame/2,
            y:100,
            text:'Ganador',
            style:{
                font:'32px arial',
                fill:'#ffffff'
            }
        });
        winnerText.setOrigin(0.5,0.5).setDepth(0);

        var winner = this.make.text({
            x:widthGame/2,
            y:150,
            text:'',
            style:{
                font:'32px arial',
                fill:'#ffffff'
            }
        });
        winner.setOrigin(0.5,0.5).setDepth(0);

        if(pointsP1 > pointsP2){
            winner.setText(nameP1);
        }else if(pointsP1 < pointsP2){
            winner.setText(nameP2);
        }else{
            winner.setText('Empate');
        }

        var pointsP1Text = this.make.text({
            x:150,
            y: 100,
            text:'Puntos '+nameP1+' : '+pointsP1,
            style:{
                font:'32px arial',
                fill:'#ffffff'
            }
        });
        pointsP1Text.setOrigin(0.5,0.5);

        var pointsP2Text = this.make.text({
            x:150,
            y: 100,
            text:'Puntos '+nameP2+' : '+pointsP2,
            style:{
                font:'32px arial',
                fill:'#ffffff'
            }
        });
        pointsP2Text.setOrigin(0.5,0.5);
    }
}