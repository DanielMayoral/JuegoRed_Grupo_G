import Player from '../player.js';
import { widthGame,heightGame } from './main.js';
import Cake from '../cake.js';
import WinnerOnline from './WinnerOnline.js';


export default class PlayOnline extends Phaser.Scene{
    constructor(){
        super({key: 'PlayOnline'});
    }


    create(){
		var musicscene= this.scene.get('MusicScene');
		musicscene.stopMusic();
		this.scene.add('WinnerScene',new WinnerOnline);
        this.initalTime = 120;
		this.add.image(0,0,'bckgroundGame').setOrigin(0,0);
        this.idEnviar = this.registry.get("id");

        this.player1 = this.add.existing(new Player(this,widthGame/2-200,heightGame-25,'cursorP1').setScale(0.5));
        this.player2 = this.add.existing(new Player(this,widthGame/2-200,heightGame-25,'cursorP2').setScale(0.5));
        this.physics.add.existing(this.player1);

        

        //variables to create background music
        this.musicgame = this.sound.add('mgame', {volume: 0.6});
        this.musicgame.setLoop(true);
        this.musicgame.play();

        this.idCake = 0;
        this.idCreation = 0;
        this.idCreationCo = 0;
        this.idCreationCok = 0;

        this.arrayCakes();

        this.cakes = this.physics.add.group({gravityY: 450});
        this.coffees = this.physics.add.group({gravityY: 300});
        this.cookies = this.physics.add.group({gravityY: 350});
        

        var escena = this;

        this.posicionX = this.player2.x;
        this.posicionY = this.player2.y;

        this.modo = this.registry.get("modo");
        this.controls = this.registry.get('controls');


        this.connection = this.registry.get("conexion");
        this.connection.onerror = function(e) {
            console.log("WS error: " + e);
        }
        this.connection.onmessage = function(msg) {
            var message = JSON.parse(msg.data)
            switch(message.type){
                case 'puntos':
                    var whoWin;
                    if(message.points < escena.player1.getPuntos()){
                        whoWin = 'Jugador 1'
                    }else{
                        whoWin = 'Jugador 2'
                    }
                    var msg = {
                        type: 'winner',
                        winner: whoWin,
                        id: escena.idEnviar
                    }
                    escena.connection.send(JSON.stringify(msg));
                    break;
                case 'posP2':
                    escena.posicionX = message.x;
                    escena.posicionY = message.y;
                    break;
                case 'cake':
                    escena.createCake?.(message.idC);
                    break;
                case 'cookie':
                    escena.createCookie?.(message.idC);
                    break;
                case 'coffee':
                    escena.createCoffee?.(message.idC);
                    break;
                case 'disconnect':
                    escena.scene.stop();
                    escena.scene.start('Lobby');
                    break;
                case 'cRecolected':
                    var listaCakes = escena.cakes.getChildren();
                    for(var i=0;i<listaCakes.length;i++){
                        if(listaCakes[i].idCreation == message.idCake){
                            escena.cakes.remove(listaCakes[i],true,true);
                        }
                    }
                    break;
                case 'cookieR':
                    var listaCookies = escena.cookies.getChildren();
                    for(var i=0;i<listaCookies.length;i++){
                        if(listaCookies[i].idCreation == message.idCookie){
                            escena.cookies.remove(listaCookies[i],true,true);
                        }
                    }
                    break;
                case 'coffeeR':
                    var listaCoffees = escena.coffees.getChildren();
                    for(var i=0;i<listaCoffees.length;i++){
                        if(listaCoffees[i].idCreation == message.idCoffee){
                            escena.coffees.remove(listaCoffees[i],true,true);
                        }
                    }
                    break;
                case 'winner':
                    escena.scene.stop();
                    escena.registry.set('Ganador',message.winner);
                    escena.scene.start('WinnerOnline');
                    break;
                case 'tiempo':
                    if(escena.initalTime > message.tiempo){
                        escena.initalTime = message.tiempo
                    }
                    break;
                case 'patron':
                if(escena.modo==='host'){
                    escena.generarPatron(message.idP);
                    }
                    break;

            }           
        }

        
        this.connection.onclose = function() {
            
            console.log("Closing socket");
        }

        this.gameOver = false;

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
        }else{
            this.input.on('pointermove', function(pointer){
                this.player1.x = pointer.x;
                this.player1.y = pointer.y;
    
                var msg = {
                    x: this.player1.x,
                    y: this.player1.y,
                    type: 'posP2',
                    id: escena.idEnviar
                };
    
                this.connection.send(JSON.stringify(msg));
    
            },this);
        }

        

        if(this.modo === 'host'){
            var generateCake = this.time.addEvent({delay: 6000, callback: this.generateNumPatron, callbackScope:this, loop:true});
            var enviarTiempo = this.time.addEvent({delay: 3000, callback: this.sendTiempo, callbackScope:this, loop:true});
        }

        this.physics.add.overlap(this.player1,this.cakes, this.collectCake,null,this);
        this.physics.add.overlap(this.player1,this.cookies, this.collectCookie,null,this);
        this.physics.add.overlap(this.player1,this.coffees, this.collectCoffee,null,this);

        //game time event
        this.texTimer = this.add.text(widthGame/2-32,0,this.formatedTime(this.initalTime));
        this.timedEvent = this.time.addEvent({delay: 1000, callback: this.onEvent, callbackScope:this, loop:true});
        

    }

    update(){

        if(this.initalTime <= 0){
            this.gameOver = true;
        }

        this.player2.x = this.posicionX;
        this.player2.y = this.posicionY;
        
        if(this.gameOver){
            this.scene.pause();
            if(this.modo === 'client'){
                var msg = {
                    type: 'puntos',
                    points: this.player1.getPuntos(),
                    id: this.idEnviar
                }
                this.connection.send(JSON.stringify(msg));
            }
        }else{
            if(this.controls === 'gamepad'){
                if(this.input.gamepad.total === 0){
                }else{
                    //move the pointer with the axis movement
                    if(this.gamepadP1.axes.length){
                        var axisHJ1 = this.gamepadP1.axes[0].getValue();
                        var axisVJ1 = this.gamepadP1.axes[1].getValue();
        
                        this.player1.x += 8 * axisHJ1;
                        this.player1.y += 8 * axisVJ1;

                        var msg = {
                            x: this.player1.x,
                            y: this.player1.y,
                            type: 'posP2',
                            id: this.idEnviar
                        };
            
                        this.connection.send(JSON.stringify(msg));

                    }
                }
            }
        }
    }

    generateCake(){
        var randNum = Phaser.Math.Between(0, 6);
        var msg = {
            idC: randNum,
            type: 'cake',
            id: this.idEnviar
        };
        this.connection.send(JSON.stringify(msg));
    }

    generateCookie(){
        var randNum = Phaser.Math.Between(0, 6);
        var msg = {
            idC: randNum,
            type: 'cookie',
            id: this.idEnviar
        };
        this.connection.send(JSON.stringify(msg));
    }

    generateCoffee(){
        var randNum = Phaser.Math.Between(0, 6);
        var msg = {
            idC: randNum,
            type: 'coffee',
            id: this.idEnviar
        };
        this.connection.send(JSON.stringify(msg));
    }

    createCake(idCake){
        var cake;
        var angle = -1.57;
        var randNum = Phaser.Math.Between(1, 3);
        var cakeArray = new Cake(this,this.arrayCakes[idCake],heightGame+50,'cake'+randNum,this.idCreation).setScale(0.25);
        this.cakes.add(cakeArray,true);
        this.idCreation++;
        this.physics.velocityFromRotation(angle,375,cakeArray.body.velocity);       
    }

    createCoffee(idCoffee){
        var angle = -1.57;
        var randNum = Phaser.Math.Between(1, 3);
        var coffeeArray = new Cake(this,this.arrayCakes[idCoffee],heightGame+50,'coffee'+randNum,this.idCreationCo).setScale(0.25);
        this.coffees.add(coffeeArray,true);
        this.idCreationCo++;
        this.physics.velocityFromRotation(angle,375,coffeeArray.body.velocity); 
    }

    createCookie(idCookie){
        var angle = -1.57;
        var cookieArray = new Cake(this,this.arrayCakes[idCookie],heightGame+50,'cookie',this.idCreationCok).setScale(1.0);
        this.cookies.add(cookieArray,true);
        this.idCreationCok++;
        this.physics.velocityFromRotation(angle,375,cookieArray.body.velocity); 
    }

    arrayCakes(){
        this.arrayCakes[0] = 100;
        this.arrayCakes[1] = 210;
        this.arrayCakes[2] = 320;
        this.arrayCakes[3] = 430;
        this.arrayCakes[4] = 540;
        this.arrayCakes[5] = 650;
        this.arrayCakes[6] = 760;
    }

    collectCake(player1,cake){
        if(this.controls === 'gamepad'){
            if(this.input.gamepad.total !== 0){
                if(this.gamepadP1.A){
                    player1.sumarPuntos(250);
                    cake.destroy();
                }
            }
        }else{
            if(this.input.activePointer.leftButtonDown()){
                player1.sumarPuntos(250);
                cake.destroy();
            }
        }

        var msg = {
            type: 'cRecolected',
            cake: cake.idCreation,
            id: this.idEnviar
        }
        
        this.connection.send(JSON.stringify(msg));
        
    }

    collectCoffee(player1,coffee){
        if(this.controls === 'gamepad'){
            if(this.input.gamepad.total !== 0){
                if(this.gamepadP1.A){
                    player1.sumarPuntos(50);
                    coffee.destroy();
                }
            }
        }else{
            if(this.input.activePointer.leftButtonDown()){
                player1.sumarPuntos(50);
                coffee.destroy();
            }
        }

        var msg = {
            type: 'coffeeR',
            coffee: coffee.idCreation,
            id: this.idEnviar
        }
        
        this.connection.send(JSON.stringify(msg));
    }

    collectCookie(player1,cookie){
        if(this.controls === 'gamepad'){
            if(this.input.gamepad.total !== 0){
                if(this.gamepadP1.A){
                    player1.sumarPuntos(150);
                    cookie.destroy();
                }
            }
        }else{
            if(this.input.activePointer.leftButtonDown()){
                player1.sumarPuntos(150);
                cookie.destroy();
            }
        }

        var msg = {
            type: 'cookieR',
            cookie: cookie.idCreation,
            id: this.idEnviar
        }
        
        this.connection.send(JSON.stringify(msg));
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

    sendTiempo(){
        var msg = {
            type: 'tiempo',
            tiempo: this.initalTime,
            id: this.idEnviar
        }

        this.connection.send(JSON.stringify(msg));
    }

    generateNumPatron(){
        var randNum = Phaser.Math.Between(0, 3);
        var msg = {
            idP: randNum,
            type: 'patron',
            id: this.idEnviar
        };
        this.connection.send(JSON.stringify(msg));
    }

	stopmusic(){
		this.musicgame.stop();
	}

    //function that is called after 6 sec
    generarPatron(patron){
        switch(patron){
            case '0':
                this.patron1();
                break;
            case '1':
                this.patron2();
                break;
            case '2':
                this.patron3();
                break;
            case '3':
                this.patron4();
                break;
        }
        
    }

    
    //patrons to creation of the objects
    patron1(){
        console.log("estoy en patron 1");
        var scene = this;
        setTimeout(function(){
            scene.generateCoffee();
            scene.generateCoffee();
            
        },1000);
        setTimeout(function(){
            scene.generateCookie();
        },2000);
        setTimeout(function(){

        },1000);
    }

    patron2(){
        console.log("estoy en patron 2");
        var scene = this;
        this.generateCoffee();
        setTimeout(function(){
            scene.generateCake();
            scene.generateCookie();
        },1000);
        setTimeout(function(){
            scene.generateCoffee();
            scene.generateCookie();
        },2000)
        setTimeout(function(){

        },1000);
    }

    patron3(){
        console.log("estoy en patron 3");
        var scene = this;
        setTimeout(function(){
            scene.generateCookie();
            scene.generateCoffee();
        },1000)
        setTimeout(function(){
            scene.generateCoffee();
        },1000)
        setTimeout(() => {
            scene.generateCoffee();
        }, 1000);
        setTimeout(function(){

        },1000);
    }

    patron4(){
        console.log("estoy en patron 4");
        var scene = this;
        this.generateCake();
        setTimeout(function(){
            scene.generateCookie();
        },1000);
        setTimeout(function(){
            scene.generateCoffee();
        },1000)
        setTimeout(function(){

        },2000);
    }

}