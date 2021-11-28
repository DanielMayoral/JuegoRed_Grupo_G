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
        this.scene.add('WinnerScene',new winnerScene);

        this.add.image(0,0,'bckgroundGame').setOrigin(0,0).setScale(0.5);

        this.musicgame = this.sound.add('mgame', {volume: 0.3});
        this.musicgame.setLoop(true);
        this.musicgame.play();

        this.platform = this.physics.add.staticGroup();
        this.platform.create(400, heightGame+150,'ground').setScale(2).refreshBody();

        //get the game mode that player chosen
        this.gameMode = this.registry.get('gamemode');

        this.cakes = this.physics.add.group();
        //this.cake = this.cakes.create(100,100, 'cake').setScale(0.25);

        //time variable to generate items
        this.generateTime = 4000;
        this.cookieTime = Phaser.Math.Between(8000,12000);
        this.cakeTime = Phaser.Math.Between(25000,35000);

        //boolean to control the game over
        this.gameOver = false;

        //connect gamepad
        this.input.gamepad.start();

        //generate cakes event
        this.generateCoffee = this.time.addEvent({delay: this.generateTime, callback: this.createCoffee, callbackScope:this, loop:true});
        this.generateCookie = this.time.addEvent({delay:this.cookieTime, callback:this.createCookie, callbackScope:this, loop:true});
        this.generateCake = this.time.addEvent({delay:this.cakeTime, callback:this.createCake, callbackScope:this, loop:true});
        

        
        if(this.gameMode === 'Singleplayer'){
            this.createSP();
        }else if(this.gameMode === 'Multiplayer'){
            this.createMP();
        }
        
    }


    //create for Singleplayer
    createSP(){
        //create player and objects
        this.player1 = new Player(this,100,heightGame-20,'cursorP1').setScale(0.75);
        this.playerLifes = 3;
        
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


        //text with player's points
        this.pointsTextP1 = this.make.text({
            x: 65,
            y: 10,
            text: 'Points Player 1: '+this.player1.getPoints(),
            style: {
                font: '12px arial',
                fill: '#000000'
            }
        });
        this.pointsTextP1.setOrigin(0.5,0.5);

        this.lifesText = this.make.text({
            x: 65,
            y: 30,
            text: 'Lifes: '+this.playerLifes,
            style: {
                font:'12px arial',
                fill: '#000000'
            }
        });
        this.lifesText.setOrigin(0.5,0.5);

        //player's collision with objects 
        this.physics.add.overlap(this.player1,this.cakes, this.collectCakeJ1,null,this);

        //pause the scene with start button
        this.gamepadP1.on('up',(index,value,button) =>{
            if(index === 9){
                this.createWindow();
                this.musicgame.pause();
                this.scene.pause();
            }
        });
    }

    
    //create for Multiplayer offline
    createMP(){

        //time variable for play time control
        this.initalTime = 15;

        //create player and objects
        this.player1 = new Player(this,100,heightGame-20,'cursorP1').setScale(0.75);
        this.player2 = new Player(this,100,heightGame-20,'cursorP2').setScale(0.75);
        
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


        //text with player's points
        this.pointsTextP1 = this.make.text({
            x: 50,
            y: 10,
            text: 'Points Player 1: '+this.player1.getPoints(),
            style: {
                font: '12px arial',
                fill: '#ffffff'
            }
        });
        this.pointsTextP1.setOrigin(0.5,0.5);

        this.pointsTextP2 = this.make.text({
            x: 50,
            y: 30,
            text: 'Points Player 2: '+this.player2.getPoints(),
            style: {
                font: '12px arial',
                fill: '#ffffff'
            }
        });
        this.pointsTextP2.setOrigin(0.5,0.5);

        //player's collision with objects 
        this.physics.add.overlap(this.player1,this.cakes, this.collectCakeJ1,null,this);
        this.physics.add.overlap(this.player2,this.cakes, this.collectCakeJ2,null,this);

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

        //game time event
        this.texTimer = this.add.text(widthGame/2-32,0,this.formatedTime(this.initalTime));
        this.timedEvent = this.time.addEvent({delay: 1000, callback: this.onEvent, callbackScope:this, loop:true});
    }

    update(){

        //this.musicgame.resume();

        //reasing delay time
        this.generateCoffee.delay = this.generateTime;

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

    updateSP(){
        if(this.playerLifes <= 0){
            this.gameOver = true;
        }

        this.lifesText.setText("Lifes: "+this.playerLifes);

        //console.log(this.input.gamepad.pad2.index);
        //update points
        this.pointsTextP1.setText('Points Player 1: '+this.player1.getPoints());

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

        this.physics.add.overlap(this.cakes,this.platform, this.removeLife,null,this);
    }

    updateMP(){
        if(this.initalTime <= 0){
            this.gameOver = true;
        }

        //console.log(this.input.gamepad.pad2.index);
        //update points
        this.pointsTextP1.setText('Points Player 1: '+this.player1.getPoints());
        this.pointsTextP2.setText('Points Player 2: '+this.player2.getPoints());

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
    }

    
    collectCakeJ1(player1,cake){
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
    }

    collectCakeJ2(player2,cake){
        if(this.input.gamepad.total !== 0){
            if(this.gamepadP2.A){
                if(cake.texture.key === 'cake1' || cake.texture.key === 'cake2' || cake.texture.key === 'cake3'){
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
    }


    //function to create cake object
    createCake(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var cake;
        var angle = -1.57;
        var randNum = Phaser.Math.Between(1, 3);
        cake = this.cakes.create(posX,heightGame+50,'cake'+randNum).setScale(0.5);
        this.physics.velocityFromRotation(angle,375,cake.body.velocity);       
        cake.setGravity(0,300);
    }

    //function to create cookie object
    createCookie(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var cookie;
        var angle = -1.57;
        cookie = this.cakes.create(posX,heightGame+50,'cookie').setScale(0.5);
        this.physics.velocityFromRotation(angle,375,cookie.body.velocity);
        cookie.setGravity(0,250);
    }

    //function to create coffee object
    createCoffee(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var coffee;
        var angle = -1.57;
        var randNum = Phaser.Math.Between(1,3);
        coffee = this.cakes.create(posX,heightGame+50,'coffee'+randNum).setScale(0.5);
        this.physics.velocityFromRotation(angle,375,coffee.body.velocity);
        this.generateTime -= 100;
        if(this.generateTime <= 1000){
            this.generateTime = 1000;
        }
        coffee.setGravity(0,200);
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

        
        this.registry.set('padP1',this.gamepadP1);
        this.registry.set('padP2',this.gamepadP2);

        var demo = new PauseScene();

        this.scene.add('PauseScene',demo,true);
    }

    removeLife(cake,platform){
        this.playerLifes--;
        cake.destroy();
    }
}

