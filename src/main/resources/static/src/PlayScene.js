import Player from "./player.js";
import PauseScene from "./PauseScene.js";
import {widthGame, heightGame} from './main.js';
import winnerScene from "./WinnerScene.js";

export default class PlayScene extends Phaser.Scene{
    constructor(){
        super({key : 'PlayScene'});

    }

    preload(){
        this.load.image('ground','assets/platform.png');
    }


    create(){
		var musicscene= this.scene.get('MusicScene');
		musicscene.stopMusic();
        //variable to know what control is used
        this.controls = this.registry.get('controls');
        this.scene.add('WinnerScene',new winnerScene);

        this.add.image(0,0,'bckgroundGame').setOrigin(0,0);

        //variables to create background music
        this.musicgame = this.sound.add('mgame', {volume: 0.6});
        this.musicgame.setLoop(true);
        this.musicgame.play();

        //create a platform out of screen, that object collide with it and remove a life from the player
        this.platform = this.physics.add.staticGroup();
        this.platform.create(400, heightGame+200,'ground').setScale(2).refreshBody();

        //get the game mode that player chosen
        this.gameMode = this.registry.get('gamemode');

        this.cakes = this.physics.add.group();
        //this.cake = this.cakes.create(100,100, 'cake').setScale(0.25);

        //time variable to generate items
        this.timeGenerate = 2000;
        this.firstCreate = false;
        /*this.generateTime = 4000;
        this.cookieTime = Phaser.Math.Between(8000,12000);
        this.cakeTime = Phaser.Math.Between(25000,35000);*/

        //boolean to control the game over
        this.gameOver = false;

        //connect gamepad
        this.input.gamepad.start();

        //generate objects event
        this.generateCoffee = this.time.addEvent({delay: 6000, callback: this.generarPatron, callbackScope:this, loop:true});

        

        
        /*this.generateCookie = this.time.addEvent({delay:this.cookieTime, callback:this.createCookie, callbackScope:this, loop:true});
        this.generateCake = this.time.addEvent({delay:this.cakeTime, callback:this.createCake, callbackScope:this, loop:true});*/
        

        if(this.gameMode === 'Singleplayer'){
            this.createSP();
        }else if(this.gameMode === 'Multiplayer'){
            this.createMP();
        }
        this.cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S , 
        'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D});
		this.actionP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.pauseAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

		var scene = this;
		this.pauseAction.on('up',function(event){
            scene.createWindow();
            scene.scene.pause();
})

    }


    //create for Singleplayer
    createSP(){
        //create player and objects
        this.player1 = new Player(this,100,heightGame-20,'cursorP1').setScale(0.5);
        this.playerLifes = 3;
        
        if(this.controls === 'gamepad'){
            //The computer allocates two pads to the same physical controller,
            //one with tilt and the other without it. The tilt is necessary to play 
            //and that's why it should be check if the gamepad's game is the pad with 
            //tilt, and if it isn't, it is changed to the other one
            this.gamepadP1 = this.input.gamepad.pad1;
            if(this.gamepadP1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                this.gamepadP1 = this.input.gamepad.pad2;
                if(this.gamepadP1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                    this.gamepadP1 = this.input.gamepad.pad3;
                    if(this.gamepadP1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                        this.gamepadP1 = this.input.gamepad.pad4;
                        this.padSelect = 4;
                    }else{
                        this.padSelect = 3;
                    }
                }else{
                    this.padSelect = 2;
                }
            }else{
                this.padSelect = 1;
            }

            //pause the scene with start button
            this.gamepadP1.on('up',(index,value,button) =>{
                if(index === 9){
                    this.createWindow();
                    this.musicgame.pause();
                    this.scene.pause();
                }
            });
        }
        
        this.add.image(0, 0, 'fondoPuntuaciones').setScale(0.35).setOrigin(0, 0);

        //text with player's points
        this.pointsTextP1 = this.make.text({
            x: 25,
            y: 12,
            text: 'Points Player 1: '+this.player1.getPoints(),
            style: {
                font: '15px catCafe',
                fill: '#fff'
            }
        });
        this.pointsTextP1.setOrigin(0,0);

        this.lifesText = this.make.text({
            x: 25,
            y: 32,
            text: 'Lifes: '+this.playerLifes,
            style: {
                font:'15px catCafe',
                fill: '#fff'
            }
        });
        this.lifesText.setOrigin(0,0);

        //player's collision with objects 
        this.physics.add.overlap(this.player1,this.cakes, this.collectCakeJ1,null,this);

        this.physics.add.overlap(this.cakes,this.platform, this.removeLife,null,this);

        
    }

    
    //create for Multiplayer offline
    createMP(){

        //time variable for play time control
        this.initalTime = 120;

        //create player and objects
        this.player1 = new Player(this,100,heightGame-20,'cursorP1').setScale(0.5);
        this.player2 = new Player(this,100,heightGame-20,'cursorP2').setScale(0.5);
        
        if(this.controls === 'gamepad'){
            //The computer allocates two pads to the same physical controller,
            //one with tilt and the other without it. The tilt is necessary to play 
            //and that's why it should be check if the gamepad's game is the pad with 
            //tilt, and if it isn't, it is changed to the other one
            this.gamepadP1 = this.input.gamepad.pad1;
            this.gamepadP2 = this.input.gamepad.pad2;

            if(this.gamepadP1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                this.gamepadP1 = this.input.gamepad.pad2;
                if(this.gamepadP1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                    this.gamepadP1 = this.input.gamepad.pad3;
                    if(this.gamepadP1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                        this.gamepadP1 = this.input.gamepad.pad4;
                        this.padSelect = 4;
                    }else{
                        this.padSelect = 3;
                    }
                }else{
                    this.padSelect = 2;
                }
            }else{
                this.padSelect = 1;
            }
            switch(this.padSelect){
                case 1:
                    if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                        this.gamepadP2 = this.input.gamepad.pad3;
                        if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                            this.gamepadP2 = this.input.gamepad.pad4;
                        }
                    }
                    break;
                case 2:
                    this.gamepadP2 = this.input.gamepad.pad1;
                    if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                        this.gamepadP2 = this.input.gamepad.pad3;
                        if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                            this.gamepadP2 = this.input.gamepad.pad4;
                        }
                    }
                    break;
                case 3:
                    this.gamepadP2 = this.input.gamepad.pad1;
                    if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                        this.gamepadP2 = this.input.gamepad.pad2;
                        if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                            this.gamepadP2 = this.input.gamepad.pad4;
                        }
                    }
                    break;
                case 4:
                    this.gamepadP2 = this.input.gamepad.pad1;
                    if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                        this.gamepadP2 = this.input.gamepad.pad2;
                        if(this.gamepadP2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                            this.gamepadP2 = this.input.gamepad.pad3;
                        }
                    }
                break;
            }

            //pause the scene with start button
            this.gamepadP1.on('up',(index,value,button) =>{
                if(index === 9){
                    this.createWindow();
                    this.musicgame.pause();
                    this.scene.pause();
                }
            });

            this.gamepadP2.on('up',(index,value,button) =>{
                if(index === 9){
                    this.createWindow();
                    this.musicgame.pause();
                    this.scene.pause();
                    
                }
            });
        }

        this.add.image(0, 0, 'fondoPuntuaciones').setScale(0.4).setOrigin(0, 0);

        //text with player's points
        this.pointsTextP1 = this.make.text({
            x: 90,
            y: 23,
            text: 'Points Player 1: '+this.player1.getPoints(),
            style: {
                font: '18px catCafe',
                fill: '#ffffff'
            }
        });
        this.pointsTextP1.setOrigin(0.5,0.5);

        this.pointsTextP2 = this.make.text({
            x: 90,
            y: 43,
            text: 'Points Player 2: '+this.player2.getPoints(),
            style: {
                font: '18px catCafe',
                fill: '#ffffff'
            }
        });
        this.pointsTextP2.setOrigin(0.5,0.5);

        //player's collision with objects 
        this.physics.add.overlap(this.player1,this.cakes, this.collectCakeJ1,null,this);
        this.physics.add.overlap(this.player2,this.cakes, this.collectCakeJ2,null,this);

        

        //game time event
        this.texTimer = this.add.text(widthGame/2-32,0,this.formatedTime(this.initalTime)).setFontSize(30);
        this.timedEvent = this.time.addEvent({delay: 1000, callback: this.onEvent, callbackScope:this, loop:true});
    }

    //update from the game
    update(){
        //this.musicgame.resume();

        //reasing delay time
        //this.generateCoffee.delay = this.generateTime;

        if(!this.firstCreate){
            this.firstCreate = true;
        }

        if(this.gameMode === 'Singleplayer'){
            if(!this.gameOver){
                this.updateSP();
            }else{
                this.registry.set('pointsP1',this.player1.getPoints());
                this.musicgame.stop();
                this.scene.start('WinnerScene');
            }
        }else if(this.gameMode === 'Multiplayer'){
            if(!this.gameOver){
                this.updateMP();
            }else{
                this.registry.set('pointsP1',this.player1.getPoints());
                this.registry.set('pointsP2',this.player2.getPoints());
                this.musicgame.stop();
                this.scene.start('WinnerScene');
            }
        }

       
    }

    //update to singleplayer mode
    updateSP(){
        if(this.playerLifes <= 0){
            this.gameOver = true;
        }

        this.lifesText.setText("Lifes: "+this.playerLifes);

        //update points
        this.pointsTextP1.setText('Points Player 1: '+this.player1.getPoints());

        if(this.controls === 'gamepad'){
            if(this.input.gamepad.total === 0){
                //console.log("No hay gamepad");
            }else{
                //move the pointer with the axis movement
                if(this.gamepadP1.axes.length){
                    var axisHJ1 = this.gamepadP1.axes[0].getValue();
                    var axisVJ1 = this.gamepadP1.axes[1].getValue();
    
                    this.player1.x += 8 * axisHJ1;
                    this.player1.y += 8 * axisVJ1;
                }
            }
        }else{
            //move the player with the pointer movement
            this.input.on('pointermove',function(pointer){
                this.player1.x = pointer.x;
                this.player1.y = pointer.y;
            },this);
        }
        

        

    }

    //update to multiplayer mode
    updateMP(){
        if(this.initalTime <= 0){
            this.gameOver = true;
        }

        //console.log(this.input.gamepad.pad2.index);
        //update points
        this.pointsTextP1.setText('Points Player 1: '+this.player1.getPoints());
        this.pointsTextP2.setText('Points Player 2: '+this.player2.getPoints());

        if(this.controls=== 'gamepad'){
            if(this.input.gamepad.total === 0){
                //console.log("No hay gamepad");
            }else{
                //move the pointer with the axis movement
                if(this.gamepadP1.axes.length){
                    var axisHJ1 = this.gamepadP1.axes[0].getValue();
                    var axisVJ1 = this.gamepadP1.axes[1].getValue();
    
                    this.player1.x += 8 * axisHJ1;
                    this.player1.y += 8 * axisVJ1;
                }
    
                    
                    
                if(this.gamepadP2.axes.length){
                    var axisHJ2 = this.gamepadP2.axes[0].getValue();
                    var axisVJ2 = this.gamepadP2.axes[1].getValue();
    
                    this.player2.x += 8 * axisHJ2;
                    this.player2.y += 8 * axisVJ2;
                }  
            }
        }else{
            //move player1 with mouse
            this.input.on('pointermove',function(pointer){
                this.player1.x = pointer.x;
                this.player1.y = pointer.y;
            },this);

            //move player2 with wasd
            //controles de jugador 2 con wasd y spacebar coger objeto
            if(this.cursors.left.isDown){
                this.player2.setVelocityX(-500);
			}else if(this.cursors.right.isDown){
                this.player2.setVelocityX(500);
			}else{
                this.player2.setVelocityX(0);
			}

			if(this.cursors.up.isDown){
                this.player2.setVelocityY(-500);
			}else if(this.cursors.down.isDown){
                this.player2.setVelocityY(500);
			}else{
                this.player2.setVelocityY(0);
			}
        }
        
    }

    //function to control how player1 collect a object
    collectCakeJ1(player1,cake){
        if(this.controls === 'gamepad'){
            if(this.input.gamepad.total !== 0){
                if(this.gamepadP1.A){
                    if(cake.texture.key === 'cake1' || cake.texture.key === 'cake2' || cake.texture.key === 'cake3'){
                        player1.addPoint(250);
                    }else if(cake.texture.key === 'cookie'){
                        player1.addPoint(150);
                    }else{
                        player1.addPoint(50);
                    }
                    cake.destroy();
                    //console.log("Pastel cogido J1");
                }
            }
        }else{
            if(this.input.activePointer.leftButtonDown()){
                if(cake.texture.key === 'cake1' || cake.texture.key === 'cake2' || cake.texture.key === 'cake3'){
                    player1.addPoint(250);
                }else if(cake.texture.key === 'cookie'){
                    player1.addPoint(150);
                }else{
                    player1.addPoint(50);
                }
                cake.destroy();
            }
        }
        
    }

    //function to control how player2 collect a object
    collectCakeJ2(player2,cake){
        if(this.controls === 'gamepad'){
            if(this.input.gamepad.total !== 0){
                if(this.gamepadP2.A){
                    if(cake.texture.key === 'cake1'||cake.texture.key === 'cake2'||cake.texture.key === 'cake3'){
                        player2.addPoint(250);
                    }else if(cake.texture.key === 'cookie'){
                        player2.addPoint(150);
                    }else{
                        player2.addPoint(50);
                    }
                    cake.destroy();
                    //console.log("Pastel cogido J1");
                }
            }
        }else{
            if(this.actionP2.isDown){
                if(cake.texture.key === 'cake1'|| cake.texture.key === 'cake2' || cake.texture.key === 'cake3'){
                    player2.addPoint(250);
                }else if(cake.texture.key === 'cookie'){
                    player2.addPoint(150);
                }else{
                    player2.addPoint(50);
                }
                cake.destroy();
            }
        }

    }


    //function to create cake object
    createCake(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var cake;
        var angle = -1.57;
        var randNum = Phaser.Math.Between(1, 3);
        cake = this.cakes.create(posX,heightGame+50,'cake'+randNum).setScale(0.25);
        this.physics.velocityFromRotation(angle,375,cake.body.velocity);       
        cake.setGravity(0,450);
    }

    //function to create cookie object
    createCookie(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var cookie;
        var angle = -1.57;
        cookie = this.cakes.create(posX,heightGame+50,'cookie').setScale(1.0);
        this.physics.velocityFromRotation(angle,375,cookie.body.velocity);
        cookie.setGravity(0,350);
    }

    //function to create coffee object
    createCoffee(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var coffee;
        var angle = -1.57;
        var randNum = Phaser.Math.Between(1,3);
        coffee = this.cakes.create(posX,heightGame+50,'coffee'+randNum).setScale(0.25);
        this.physics.velocityFromRotation(angle,375,coffee.body.velocity);
        /*this.generateTime -= 100;
        if(this.generateTime <= 1000){
            this.generateTime = 1000;
        }*/
        coffee.setGravity(0,300);
    }
    

    //function that formate the text time to minutes and seconds
    formatedTime(time){
        var minutes = Math.floor(time/60);
        var seconds = time%60;
        seconds = seconds.toString().padStart(2,'0');
        return `${minutes}:${seconds}`;
    }

    //event that sustract one second to game's time
    onEvent(){
        this.initalTime -= 1;
        this.texTimer.setText(this.formatedTime(this.initalTime));
        
    }

    //function to create a PauseScene
    createWindow(){
        var win = this.add.zone(widthGame/2,heightGame/2,500,200).setInteractive().setOrigin(0);

        if(this.controls === 'gamepad'){
            this.registry.set('padP1',this.gamepadP1);
            this.registry.set('padP2',this.gamepadP2);
        }
        var demo = new PauseScene();

        this.scene.add('PauseScene',demo,true);
    }

    //function to remove a life from the player in Singleplayer
    removeLife(cake,platform){
        this.playerLifes--;
        cake.destroy();
    }
    
    stopmusic(){
		this.musicgame.stop();
	}


    //function that is called 
    generarPatron(){
        this.firstCreate = true;
        var randNum = Phaser.Math.Between(0,3);
        switch(randNum){
            case 0:
                this.patron1();
                break;
            case 1:
                this.patron2();
                break;
            case 2:
                this.patron3();
                break;
            case 3:
                this.patron4();
                break;
        }
    }

    
    //patrons to creation of the objects
    patron1(){
        var scene = this;
        setTimeout(function(){
            scene.createCoffee();
            scene.createCake();
            
        },1000);
        setTimeout(function(){
            scene.createCoffee();
            scene.createCookie();
        },2000);
        setTimeout(function(){
			scene.createCoffee();
        },1000);
    }

    patron2(){
        var scene = this;
        this.createCookie();
        setTimeout(function(){
            scene.createCoffee();
            scene.createCoffee();
        },1000);
        setTimeout(function(){
            scene.createCoffee();
            scene.createCake();
        },2000)
        setTimeout(function(){

        },1000);
    }

    patron3(){
        var scene = this;
        setTimeout(function(){
            scene.createCoffee();
            scene.createCoffee();
        },1000)
        setTimeout(function(){
            scene.createCake();
        },1000)
        setTimeout(() => {
            scene.createCookie();
        }, 1000);
        setTimeout(function(){

        },1000);
    }

    patron4(){
        var scene = this;
        this.createCoffee();
        setTimeout(function(){
            scene.createCoffee();
        },1000);
        setTimeout(function(){
            scene.createCookie();
        },1000)
        setTimeout(function(){

        },2000);
    }
}



