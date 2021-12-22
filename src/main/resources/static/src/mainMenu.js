import { heightGame, widthGame, user } from "./main.js";
import NumberPLayer from "./NumberPlayer.js";

export default class mainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'mainMenu' })
	}

	create() {
		this.add.image(0, 0, 'background').setOrigin(0, 0);
		this.add.image(50, 0, 'logocoffee').setOrigin(0, 0).setScale(0.6);
		this.add.image(10, 298, 'logomooncake').setOrigin(0, 0);

		this.controls = this.registry.get('controls');
		
		this.add.image(620,260,'tablonOscuro').setScale(1.2);
		this.add.image(550,80,'burounkohi').setScale(0.3).setOrigin(0.0);
		//this.time.events.add(Phaser.Timer.SECOND * 2, chatLoop, this);

		//button to go to PlayScene, that's the scen with the gameplay
		var startButton = this.add.image(510, 180, 'start').setScale(0.5).setOrigin(0, 0);
		var optionsButton = this.add.image(500, 240, 'botonOpciones').setScale(0.5).setOrigin(0, 0);
		var creditsButton = this.add.image(490, 300, 'botonCreditos').setScale(0.5).setOrigin(0, 0);
		
		if(this.controls === 'gamepad'){
			this.gamepadControl(startButton, optionsButton, creditsButton);
		}else{
			startButton.setInteractive();
			optionsButton.setInteractive();
			creditsButton.setInteractive();

			startButton.on('pointerdown', ()=>{
				this.createWindow();
				this.scene.pause();
			});
			optionsButton.on('pointerdown',()=>{
				this.scene.start('OptionsScene');
				this.scene.stop();
		});
			creditsButton.on('pointerdown',()=>{
				this.scene.start('CreditsScene');
				this.scene.stop();
			});
		}

		//boton.setInteractive();
		//boton.on('pointerdown',()=>{this.scene.start('PlayScene')});	
		
		
	}

	update() {
	}
	
	

	createWindow() {

		var win = this.add.zone(widthGame / 2, heightGame / 2, 500, 300).setInteractive().setOrigin(0);

		var demo = new NumberPLayer();

		this.scene.add('NumberPlayer', demo, true);
	}

	gamepadControl(startButton, optionsButton, creditsButton){
		startButton.alpha = 0.5;
		this.input.gamepad.start();
		var pointer = { x: startButton.x, y: startButton.y };
		this.input.gamepad.pad1.on('up', (index, value, button) => {
			if (index === 0) {
				var chat = document.getElementById('chat');
				var mensajesChat = document.getElementById('mensajesChat');
				chat.remove();
				mensajesChat.remove();
				if (pointer.y === startButton.y) {
					this.createWindow();
					this.scene.pause();
				} else if (pointer.y === creditsButton.y) {
					this.scene.start('CreditsScene');
					this.scene.stop();
				} else if (pointer.y === optionsButton.y) {
					this.scene.start('OptionsScene');
					this.scene.stop();
				}
			} else if (index === 14) {
				console.log("Pulsado boton");
				if (pointer.y === startButton.y) {
					pointer.y = optionsButton.y;
					optionsButton.alpha = 0.5;
					startButton.alpha = 1;
				} else if (pointer.y === creditsButton.y) {
					pointer.y = startButton.y;
					startButton.alpha = 0.5;
					creditsButton.alpha = 1;
				} else {
					pointer.y = creditsButton.y;
					optionsButton.alpha = 1;
					creditsButton.alpha = 0.5;
				}
			} else if (index === 15) {
				if (pointer.y === startButton.y) {
					pointer.y = creditsButton.y;
					creditsButton.alpha = 0.5;
					startButton.alpha = 1;
				} else if (pointer.y === creditsButton.y) {
					pointer.y = optionsButton.y;
					optionsButton.alpha = 0.5;
					creditsButton.alpha = 1;
				} else {
					pointer.y = startButton.y;
					optionsButton.alpha = 1;
					startButton.alpha = 0.5;
				}
			}

		});
	}
}


