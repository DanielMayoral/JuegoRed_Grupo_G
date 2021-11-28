import { heightGame, widthGame, user } from "./main.js";
import NumberPLayer from "./NumberPlayer.js";

export default class mainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'mainMenu' })
	}

	create() {
		this.add.image(0, 0, 'background').setScale(0.5).setOrigin(0, 0);
		this.add.image(240, 0, 'logocoffee').setOrigin(0, 0);
		this.add.image(698, 298, 'logomooncake').setOrigin(0, 0);
		this.music = this.sound.add('mainSound', { volume: 0.3 });
		this.music.setLoop(true);
		this.music.play();
		
		
		this.updateChat = this.time.addEvent({delay: 2000, callback: this.refreshChat, callbackScope:this, loop:true});
		//this.time.events.add(Phaser.Timer.SECOND * 2, chatLoop, this);

		//button to go to PlayScene, that's the scen with the gameplay
		var startButton = this.add.image((widthGame / 2) - 100, (heightGame / 4) * 3, 'start').setScale(0.5).setOrigin(0, 0);
		var optionsButton = this.add.image((widthGame / 2) - 300, (heightGame / 4) * 3, 'botonOpciones').setScale(0.5).setOrigin(0, 0);
		var creditsButton = this.add.image((widthGame / 2) + 100, (heightGame / 4) * 3, 'botonCreditos').setScale(0.5).setOrigin(0, 0);
		
		//boton.setInteractive();
		//boton.on('pointerdown',()=>{this.scene.start('PlayScene')});
		startButton.alpha = 0.5;

		/*
		$.ajax({
			url: "http://localhost:8080/mensajes"
		}).done(function(data){
			console.log(data);
		})
		*/
		
		
		var chatCode = this.add.dom(20, 50).setOrigin(0, 0).createFromCache('messages');

		var messageCode = this.add.dom(20, 20).setOrigin(0, 0).createFromCache('chatMessage');

		messageCode.addListener('click');

		messageCode.on('click', function(event) {

			if (event.target.name === 'sendButton') {
				var inputMessage = this.getChildByName('mensajeChat');
				if (inputMessage.value !== '') {
					var message = {
						texto: inputMessage.value,
						nombreUsuario: user.nombreUsuario,
						fechaMensaje: ''
					}
					$.ajax({
						method: "POST",
						url: "http://localhost:8080/mensajes",
						data: JSON.stringify(message),
						headers: { "Content-type": "application/json" }
					})
				}
			}
			else if (event.target.name === 'logOut') {
				
				$.ajax ({
					method: "PUT",
					url: "http://localhost:8080/logout",
					data: JSON.stringify(user),
					processData: false,
					headers: { "Content-type": "application/json" }
				}).done(function(){
					user.nombreUsuario = "Guest";
				})
			}
		});

		this.input.gamepad.start();
		var pointer = { x: startButton.x, y: startButton.y };
		this.input.gamepad.pad1.on('up', (index, value, button) => {
			if (index === 0) {
				var chat = document.getElementById('chat');
				var mensajesChat = document.getElementById('mensajesChat');
				chat.remove();
				mensajesChat.remove();
				if (pointer.x === startButton.x) {
					this.music.stop();
					this.createWindow();
					this.scene.pause();
				} else if (pointer.x === creditsButton.x) {
					//this.music.stop();
					this.scene.start('CreditsScene');
					this.scene.stop();
				} else if (pointer.x === optionsButton.x) {
					//this.music.stop();
					this.scene.start('OptionsScene');
					this.scene.stop();
				}
			} else if (index === 14) {
				if (pointer.x === startButton.x) {
					pointer.x = optionsButton.x;
					optionsButton.alpha = 0.5;
					startButton.alpha = 1;
				} else if (pointer.x === creditsButton.x) {
					pointer.x = startButton.x;
					startButton.alpha = 0.5;
					creditsButton.alpha = 1;
				} else {
					pointer.x = creditsButton.x;
					optionsButton.alpha = 1;
					creditsButton.alpha = 0.5;
				}
			} else if (index === 15) {
				if (pointer.x === startButton.x) {
					pointer.x = creditsButton.x;
					creditsButton.alpha = 0.5;
					startButton.alpha = 1;
				} else if (pointer.x === creditsButton.x) {
					pointer.x = optionsButton.x;
					optionsButton.alpha = 0.5;
					creditsButton.alpha = 1;
				} else {
					pointer.x = startButton.x;
					optionsButton.alpha = 1;
					startButton.alpha = 0.5;
				}
			}

		});
		
	}

	update() {
		this.music.resume();
	}
	
	refreshChat(){
		$.ajax({
			url: "http://localhost:8080/mensajes"
		}).done(function(data) {
			$(".mensajesChat").empty();
			var array = data;
			array.forEach(element => ($(".mensajesChat").append(element)));
		})
	}

	createWindow() {
		this.music.pause();

		var win = this.add.zone(widthGame / 2, heightGame / 2, 500, 300).setInteractive().setOrigin(0);

		var demo = new NumberPLayer();

		this.scene.add('NumberPlayer', demo, true);
	}
}


