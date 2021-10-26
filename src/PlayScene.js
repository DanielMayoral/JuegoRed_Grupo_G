import Player from "./player.js";
import {widthGame, heightGame} from './main.js';
//import Objects from "./objects.js";

export default class PlayScene extends Phaser.Scene{
    constructor(){
        super({key : 'PlayScene'});

    }

    preload(){
        this.load.spritesheet('cursor','assets/cursorprueba1.png', {frameWidth:60, frameHeight: 78});
        this.load.image('fondojuego','assets/fondopartida.png');
        this.load.image('cake1','assets/pasteles/PastelMorado.png');
        this.load.image('cake2','assets/pasteles/PastelVerde.png');
        this.load.image('cake3','assets/pasteles/PastelRosa.png');
        this.load.image('cookie','/assets/Galletas.png')
        this.load.image('coffee','assets/Cafe.png');
    }

    create(){
        this.add.image(0,0,'fondojuego').setOrigin(0,0).setScale(0.5);
        //create player and objects
        this.player1 = new Player(this,100,heightGame-20,'cursor');
        this.player2 = new Player(this,200,heightGame-20,'cursor');

        this.cakes = this.physics.add.group();
        //this.cake = this.cakes.create(100,100, 'cake').setScale(0.25);

        //time variable to generate items
        this.generateTime = 4000;
        this.cookieTime = Phaser.Math.Between(8000,12000);
        this.coffeTime = Phaser.Math.Between(25000,35000);

        //time variable for play time control
        this.initalTime = 120;

        //boolean to control the game over
        this.gameOver = false;

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

        //connect gamepad
        this.input.gamepad.start();

        //player's collision with objects 
        this.physics.add.overlap(this.player1,this.cakes, this.collectCakeJ1,null,this);
        this.physics.add.overlap(this.player2,this.cakes, this.collectCakeJ2,null,this);


        //generate cakes event
        this.timeGenerate = this.time.addEvent({delay: this.generateTime, callback: this.createCake, callbackScope:this, loop:true});
        this.generateCookie = this.time.addEvent({delay:this.cookieTime, callback:this.createCookie, callbackScope:this, loop:true});
        this.generateCoffee = this.time.addEvent({delay:this.coffeTime, callback:this.createCoffee, callbackScope:this, loop:true});
        //game time event
        this.texTimer = this.add.text(widthGame/2-32,0,this.formatedTime(this.initalTime));
        this.timedEvent = this.time.addEvent({delay: 1000, callback: this.onEvent, callbackScope:this, loop:true});
    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.actionJ1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO);
    }

    update(){

        this.timeGenerate.delay = this.generateTime;

        if(this.initalTime <= 0){
            this.gameOver = true;
        }

        if(!this.gameOver){
            //update points
            this.pointsTextP1.setText('Points Player 1: '+this.player1.getPoints());
            this.pointsTextP2.setText('Points Player 2: '+this.player2.getPoints());

            if(this.input.gamepad.total === 0){
                //console.log("No hay gamepad");
            }else{

                //The computer allocates two pads to the same physical controller,
                //one with tilt and the other without it. The tilt is necessary to play 
                //and that's why it should be check if the gamepad's game is the pad with 
                //tilt, and if it isn't, it is changed to the other one
                this.gamepadJ1 = this.input.gamepad.pad1;
                if(this.gamepadJ1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                    this.gamepadJ1 = this.input.gamepad.pad3;
                }
                
                if(this.gamepadJ1.axes.length){
                    var axisHJ1 = this.gamepadJ1.axes[0].getValue();
                    var axisVJ1 = this.gamepadJ1.axes[1].getValue();

                    this.player1.x += 10 * axisHJ1;
                    this.player1.y += 10 * axisVJ1;
                }

                this.gamepadJ2 = this.input.gamepad.pad2;
                if(this.gamepadJ2.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                    this.gamepadJ2 = this.input.gamepad.pad4;
                }
                
                if(this.gamepadJ2.axes.length){
                    var axisHJ2 = this.gamepadJ2.axes[0].getValue();
                    var axisVJ2 = this.gamepadJ2.axes[1].getValue();

                    this.player2.x += 10 * axisHJ2;
                    this.player2.y += 10 * axisVJ2;
                }
                
            }
        }else{
            var winnerText = this.make.text({
                x:widthGame/2,
                y:heightGame/2,
                text:'Game Over',
                style:{
                    font:'32px arial',
                    fill:'#ffffff'
                }
            });
            winnerText.setOrigin(0.5,0.5).setDepth(0);

            this.scene.pause();
        }
    }

    
    collectCakeJ1(player1,cake){
        if(this.input.gamepad.total !== 0){
            if(this.gamepadJ1.A){
                if(cake.texture.key === 'cake'){
                    player1.addPoint(1);
                }else if(cake.texture.key === 'cookie'){
                    player1.addPoint(2);
                }else{
                    player1.addPoint(3);
                }
                cake.destroy();
                //console.log("Pastel cogido J1");
            }
        }
    }

    collectCakeJ2(player2,cake){
        if(this.input.gamepad.total !== 0){
            if(this.gamepadJ2.A){
                if(cake.texture.key === 'cake'){
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

    createCake(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var cake;
        var angle = -1.57;
        var numAle = Phaser.Math.Between(1, 3);
        cake = this.cakes.create(posX,heightGame+50,'cake'+numAle);
        this.generateTime -= 100;
        this.physics.velocityFromRotation(angle,375,cake.body.velocity);
        if(this.generateTime <= 1000){
            this.generateTime = 1000;
        }
        cake.setGravity(0,200);
    }

    createCookie(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var cookie;
        var angle = -1.57;
        cookie = this.cakes.create(posX,heightGame+50,'cookie').setScale(0.2);
        this.physics.velocityFromRotation(angle,375,cookie.body.velocity);
        cookie.setGravity(0,250);
    }

    createCoffee(){
        var posX = Phaser.Math.Between(50, widthGame-100);
        var coffee;
        var angle = -1.57;
        coffee = this.cakes.create(posX,heightGame+50,'coffee').setScale(0.2);
        this.physics.velocityFromRotation(angle,375,coffee.body.velocity);
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
}
