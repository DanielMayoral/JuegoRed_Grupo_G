import { heightGame, widthGame } from "./main.js";

export default class winnerScene extends Phaser.Scene{
    constructor(){
        super({key:'WinnerScene'});
    }


    create(){
		var menumusic = this.scene.get('MusicScene');
		var musicjuego = this.scene.get('PlayScene');
        this.nameP1 = this.registry.get('username');
        this.pointsP1 = this.registry.get('pointsP1');

        this.add.image(0,0,'bckgroundGame').setOrigin(0,0);

        this.controls = this.registry.get('controls');
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
        

        this.gameMode = this.registry.get('gamemode');

        if(this.gameMode === 'Singleplayer'){
            this.winnerSP();
        }else if(this.gameMode === 'Multiplayer'){
            this.winnerMP();
        }

    }

    winnerSP(){
       

        var pointsText = this.make.text({
            x:widthGame/2,
            y: 100,
            text:'Puntos '+this.nameP1+' : '+this.pointsP1,
            style:{
                font:'32px catCafe',
                fill:'#ffffff'
            }
        });
        pointsText.setOrigin(0.5,0.5);

        //hacer un put en base de datos si puntos es más que highscore
        this.updateHighscore();
    }

    winnerMP(){

        var pointsP1 = this.registry.get('pointsP1');
        var pointsP2 = this.registry.get('pointsP2');
		var musicjuego = this.scene.get('PlayScene');
        musicjuego.stopmusic();
        var winnerText = this.make.text({
            x:widthGame/2,
            y:160,
            text:'Ganador',
            style:{
                font:'32px catCafe',
                fill:'#ffffff'
            }
        });
        winnerText.setOrigin(0.5,0.5).setDepth(0);

        var winner = this.make.text({
            x:widthGame/2,
            y:200,
            text:'',
            style:{
                font:'32px catCafe',
                fill:'#ffffff'
            }
        });
        winner.setOrigin(0.5,0.5).setDepth(0);

        if(pointsP1 > pointsP2){
            winner.setText('Jugador 1');
        }else if(pointsP1 < pointsP2){
            winner.setText('Jugador 2');
        }else{
            winner.setText('Empate');
        }

        var pointsP1Text = this.make.text({
            x:10,
            y: 50,
            text:'Puntos '+'Jugador 1'+' : '+pointsP1,
            style:{
                font:'32px catCafe',
                fill:'#ffffff'
            }
        });
        pointsP1Text.setOrigin(0,0);

        var pointsP2Text = this.make.text({
            x:10,
            y: 100,
            text:'Puntos '+'Jugador 2'+' : '+pointsP2,
            style:{
                font:'32px catCafe',
                fill:'#ffffff'
            }
        });
        pointsP2Text.setOrigin(0,0);
    }

    getHighscore(callback){
        $.ajax({
            url: 'http://'+location.host+'/highscore/'+this.nameP1
        }).done(function(points){
            callback(points);
        })
    }

    putHighscore(user,scene,callback){
        $.ajax({
            method: "PUT",
            url: 'http://'+location.host+'/putHS',
            data: JSON.stringify(user),
            processData: false,
            headers: {
                "Content-Type": "application/json"
            },error: function(xhr,status,result){
                console.log("Error: "+xhr.responseText);
            }
        }).done(function(user){
            console.log(user);
        })
    }

    updateHighscore(){
        var scene = this;
        this.getHighscore(function(points){
            console.log(scene.pointsP1);
            if(scene.pointsP1 > points){
                var user = {
                    nombreUsuario: scene.nameP1,
                    password: '',
                    conectado: '',
                    highscore: scene.pointsP1
                }
                scene.putHighscore(user,scene,function(){

                });
            }
        })
    }
}