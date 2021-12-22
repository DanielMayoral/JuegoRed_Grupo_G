import ConnectLobby from "./ConnectLobby.js";
import CreateLobby from "./CreateLobby.js";
import { heightGame, widthGame } from "./main.js";

export default class Lobby extends Phaser.Scene{
    constructor(){
        super({key: 'Lobby'});
    }

    create(){
        this.add.image(0, 0, 'background').setOrigin(0, 0);
		this.add.image(425, 0, 'logocoffee').setOrigin(0, 0).setScale(0.6);
		this.add.image(10, 298, 'logomooncake').setOrigin(0, 0);

        var user =  this.registry.get('username');

        const div = document.createElement('div')
        div.className = 'div'

        const create = document.createElement('button')
        create.id= 'create'
        create.innerText = 'Create Lobby'

        const connect = document.createElement('button')
        connect.id= 'connect'
        connect.innerText = 'Connect to Lobby'

        div.appendChild(create)
        div.appendChild(connect)

        var element =  this.add.dom(widthGame/2,heightGame/2+150,div);
        element.addListener('click');

        var escena = this;

        element.on('click',function(event){
            if(event.target.id === 'create'){
                escena.createCreate();
            }else if(event.target.id === 'connect'){
                escena.createConnect();
            }
        })

        var chatCode = this.add.dom(20, 50).setOrigin(0, 0).createFromCache('messages');

		var messageCode = this.add.dom(20, 20).setOrigin(0, 0).createFromCache('chatMessage');

		messageCode.addListener('click');

		messageCode.on('click', function(event) {

			if (event.target.name === 'sendButton') {
				var inputMessage = this.getChildByName('mensajeChat');
				if (inputMessage.value !== '') {
					var message = {
						texto: inputMessage.value,
						nombreUsuario: user,
						fechaMensaje: ''
					}
					$.ajax({
						method: "POST",
						url: "http://"+location.host+"/mensajes",
						data: JSON.stringify(message),
						headers: { "Content-type": "application/json" }
					})
				}
			}
			else if (event.target.name === 'logOut') {
				
				$.ajax ({
					method: "PUT",
					url: "http://"+location.host+"/logout",
					data: JSON.stringify(user),
					processData: false,
					headers: { "Content-type": "application/json" }
				}).done(function(){
					user.nombreUsuario = "Guest";
				})
			}
		});


		this.updateChat = this.time.addEvent({delay: 2000, callback: this.refreshChat, callbackScope:this, loop:true});
		
    }

    createCreate(){
        var win = this.add.zone(widthGame/2,heightGame/2,500,heightGame/2+50).setInteractive().setOrigin(0);

        var demo = new CreateLobby();

        this.scene.add('CreateLobby',demo,true);
    }

    createConnect(){
        var win = this.add.zone(widthGame/2,heightGame/2,500,300).setInteractive().setOrigin(0);

        var demo = new ConnectLobby();

        this.scene.add('ConnectLobby',demo,true);
    }

    refreshChat(){
		$.ajax({
			url: "http://"+location.host+"/mensajes"
		}).done(function(data) {
			$(".mensajesChat").empty();
			var array = data;
			array.forEach(element => ($(".mensajesChat").append(element)));
		})
	}
}