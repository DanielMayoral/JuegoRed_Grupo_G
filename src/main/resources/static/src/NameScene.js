import { widthGame, heightGame, user } from "./main.js";


export default class NameScene extends Phaser.Scene {

	constructor() {
		super({ key: 'NameScene' });

		this.width = 500;
		this.height = 300;
	}

	create() {


		this.cameras.main.setViewport(widthGame / 2 - this.width / 2, heightGame / 2 - this.height / 2, this.width, this.height);

		this.gameMode = this.registry.get('gamemode');

		var logInCode = this.add.dom(this.width / 2, this.height / 2).createFromCache('login');

		logInCode.addListener('click');

		var escenaActual = this;
		
		logInCode.on('click', function(event) {

			if (event.target.name === 'signinButton') {
				var inputUsername = this.getChildByName('username');
				user.nombreUsuario = inputUsername.value;
				var inputPassword = this.getChildByName('password');

				var esto = this;
				//  Have they entered anything?
				if (inputUsername.value !== '' && inputPassword.value !== '') {
					var usuario = {
						nombreUsuario: inputUsername.value,
						password: inputPassword.value,
						conectado: 'T',
						highscore: 0
					}

					$.ajax({
						method: "POST",
						url: "http://"+location.host+"/signup",
						data: JSON.stringify(usuario),
						headers: { "Content-type": "application/json" }
					}).done(function() {
						escenaActual.registry.set('username',inputUsername.value);
						escenaActual.scene.start('mainMenu');
						esto.removeListener('click');
					}).fail(function() {
						$('#error').text('Usuario ya existe')
					})			
				}
			}
			else if (event.target.name === 'guestButton'){
				var usuario = {
						nombreUsuario: user.nombreUsuario,
						password: 'Guest4CoffeeTime',
						conectado: 'T',
						highscore: 0
					}
				$.ajax({
						method: "POST",
						url: "http://"+location.host+"/login",
						data: JSON.stringify(usuario),
						headers: { "Content-type": "application/json" }
					}).done(function() {
						escenaActual.registry.set('username','Guest');
						escenaActual.scene.start('mainMenu');
					}).fail(function() {
						escenaActual.scene.start('mainMenu');
					})
				
			}else if(event.target.name === 'loginButton'){
				var inputUsername = this.getChildByName('username');
				user.nombreUsuario = inputUsername.value;
				var inputPassword = this.getChildByName('password');

				//  Have they entered anything?
				if (inputUsername.value !== '' && inputPassword.value !== '') {
					var usuario = {
						nombreUsuario: inputUsername.value,
						password: inputPassword.value,
						conectado: 'T',
						highscore: 0
					}

					$.ajax({
						method: "POST",
						url: "http://"+location.host+"/login",
						data: JSON.stringify(usuario),
						headers: { "Content-type": "application/json" }
					}).done(function() {
						escenaActual.registry.set('username',inputUsername.value);
						escenaActual.scene.start('mainMenu');
						//esto.removeListener('click');
					}).fail(function() {
						$('#error').text('Usuario o contraseña incorrectos')
					})
				}
			}
		});
	}

}