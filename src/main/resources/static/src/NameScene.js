import { widthGame, heightGame, user } from "./main.js";


export default class NameScene extends Phaser.Scene {

	constructor() {
		super({ key: 'NameScene' });

		this.width = 500;
		this.height = 300;
	}

	create() {


		this.cameras.main.setViewport(widthGame / 2 - this.width / 2, heightGame / 2 - this.height / 2, this.width, this.height);

		this.music = this.sound.add('mainSound').setVolume(0.7).setLoop(true);
		this.music.play();

		this.gameMode = this.registry.get('gamemode');

		var logInCode = this.add.dom(this.width / 2, this.height / 2).createFromCache('login');

		logInCode.addListener('click');

		var escenaActual = this;
		
		logInCode.on('click', function(event) {

			if (event.target.name === 'loginButton') {
				var inputUsername = this.getChildByName('username');
				user.nombreUsuario = inputUsername.value;
				var inputPassword = this.getChildByName('password');

				//  Have they entered anything?
				if (inputUsername.value !== '' && inputPassword.value !== '') {
					var usuario = {
						nombreUsuario: inputUsername.value,
						password: inputPassword.value,
						conectado: 'T',
					}

					$.ajax({
						method: "POST",
						url: "http://localhost:8080/signup",
						data: JSON.stringify(usuario),
						headers: { "Content-type": "application/json" }
					}).done(function() {
						escenaActual.scene.start('mainMenu');
					}).fail(function() {
						escenaActual.scene.start('mainMenu');
					})

					//  Turn off the click events
					this.removeListener('click');
				}
			}
			else if (event.target.name === 'guestButton'){
				var usuario = {
						nombreUsuario: user.nombreUsuario,
						password: 'Guest4CoffeeTime',
						conectado: 'T',
					}
				$.ajax({
						method: "POST",
						url: "http://localhost:8080/login",
						data: JSON.stringify(usuario),
						headers: { "Content-type": "application/json" }
					}).done(function() {
						escenaActual.scene.start('mainMenu');
					}).fail(function() {
						escenaActual.scene.start('mainMenu');
					})
				
			}
		});
	}

	registreSP() {
		this.registry.set('namePlayer1', this.nameP1);
		this.scene.start('PlayScene');
		this.music.stop();
		this.scene.stop('mainMenu');
		this.scene.remove('NumberPlayer');
		this.scene.remove();
	}

	registreMP() {
		this.registry.set('namePlayer1', this.nameP1);
		this.registry.set('namePlayer2', this.nameP2);
		this.scene.start('PlayScene');
		this.music.stop();
		this.scene.stop('mainMenu');
		this.scene.remove('NumberPlayer');
		this.scene.remove();
	}
}