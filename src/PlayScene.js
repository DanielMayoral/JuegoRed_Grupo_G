import Player from "./player.js";


export default class PlayScene extends Phaser.Scene{
    constructor(){
        super({key : 'PlayScene'});

    }

    preload(){
        this.load.spritesheet('dude','assets/dude.png', {frameWidth:32, frameHeight: 45});
        this.load.image('cake','assets/cake.png');
    }

    create(){

        //create player and objects
        this.player1 = new Player(this,100,380,'dude');
        this.cakes = this.physics.add.group();
        this.cake = this.cakes.create(100,100, 'cake').setScale(0.25);

        //connect gamepad
        this.input.gamepad.start();

        //player's collision with objects 
        this.physics.add.overlap(this.player1,this.cake, this.collectCake,null,this);

    }

    update(){

        if(this.input.gamepad.total === 0){
            console.log("No hay gamepad");
        }else{

            //The computer allocates two pads to the same physical controller,
            //one with tilt and the other without it. The tilt is necessary to play 
            //and that's why it should be check if the gamepad's game is the pad with 
            //tilt, and if it isn't, it is changed to the other one
            this.gamepadJ1 = this.input.gamepad.pad1;
            if(this.gamepadJ1.id !== 'Xbox 360 Controller (XInput STANDARD GAMEPAD)'){
                this.gamepadJ1 = this.input.gamepad.pad2;
            }
            
            if(this.gamepadJ1.axes.length){
                var axisHJ1 = this.gamepadJ1.axes[0].getValue();
                var axisVJ1 = this.gamepadJ1.axes[1].getValue();

                this.player1.x += 4 * axisHJ1;
                this.player1.y += 4 * axisVJ1;
                //this.player1.setVelocityX(40*axisHJ1);
                //this.player1.setVelocityY(40*axisVJ1);
            }
            
        }

    }

    
    collectCake(player1,cake){
        if(this.input.gamepad.total !== 0){
            if(this.gamepadJ1.A){
                cake.destroy();
                console.log("Pastel cogido J1");
            }
        }
    }
}
