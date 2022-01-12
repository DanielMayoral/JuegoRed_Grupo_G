import { widthGame, heightGame } from "./main.js";

export default class CreateLobby extends Phaser.Scene{
    constructor(){
        super({key: 'CreateLobby'});
    }

    create(){
        this.code = Phaser.Math.Between(0, 999999)
        this.lobbyCreado = false;
        this.numeroActivos = 0;
        this.noActivo = false;
        this.idJ1 = "";
        this.idJ2 = "";
        var escena = this;
		this.add.image(widthGame/2,heightGame/2+100,'botonBase').setScale(0.7)
        this.codigo = this.make.text({
            x: widthGame/2,
            y: heightGame/2+100,
            text: 'Codigo: '+ this.code,
            style: {
                font: '30px catCafe',
                fill: '#000'
            }
        });
        this.codigo.setOrigin(0.5,0.5);

        this.conexion = new WebSocket('ws://'+location.host+'/game/'+this.code);

        

        this.conexion.onmessage = function(msg){
            var message = JSON.parse(msg.data)
            escena.idJ1 = message.id

            switch(message.type){
                case 'id':
                    var lobby = {
                        codigo: escena.code,
                        numeroJugadores: 1,
                        numeroActivos: 0,
                        idP1: escena.idJ1,
                        idP2: ""
                    };

                    console.log(lobby);
        
                    escena.crearLobby(lobby,escena,function(){
                    });
                    escena.lobbyCreado = true;
                    break;
                case 'start':
                    escena.registry.set("id",escena.idJ2);
                    escena.registry.set("modo","host");
                    escena.scene.stop('MusicScene');
                    escena.scene.start("PlayOnline");                    
                    escena.scene.stop("Lobby");
                    escena.scene.remove(escena);
                    break;

            }
            //console.log(escena.idJ1);

            
        }

        this.registry.set("conexion",this.conexion);

        var caja = document.createElement('div')
        caja.className = 'cajita'

        this.boton = document.createElement('button')
        this.boton.id= 'add-button'
        this.boton.innerText = 'Start'

        this.listo = document.createElement('button')
        this.listo.id= 'empezar'
        this.listo.innerText = 'Listo'
        this.listo.style.display = 'none';

        caja.appendChild(this.boton)
        caja.appendChild(this.listo)

        var element =  this.add.dom(widthGame/2,heightGame/2+150,caja);
        element.addListener('click');

        

        var infoLobby = this.time.addEvent({delay: 1000, callback: this.almacenaInfoLobby, callbackScope:this, loop:true});

        element.on('click',function(event){
            if(event.target.id === 'add-button'){
                var msg = {
                    type: "id",
                    id: ""
                };
                escena.conexion.send(JSON.stringify(msg));
                //console.log(escena.idJ1)

                
            }else if(event.target.id === 'empezar'){
                //console.log(escena.noActivo);
                if(escena.numeroActivos < 2 && !escena.noActivo){
                    var lobby = {
                        codigo: escena.code,
                        numeroJugadores: 1,
                        numeroActivos: 0,
                        idP1: escena.idJ1,
                        idP2: ""
                    };
                    escena.activoPartida(lobby,escena,function(){
                        
                    });
                    escena.noActivo = true;
                    escena.codigo.text += " Waiting..."
                }else if(escena.numeroActivos < 2 && !escena.noActivo){
                    escena.codigo.text += " Waiting..."
                }
                
            }
        })
    }

    crearLobby(lobby,scene,callback){
        $.ajax({
            method: "POST",
            url: 'http://'+location.host+'/lobby',
            data: JSON.stringify(lobby),
            processData: false,
            headers: {
                "Content-Type" : "application/json"
            },error: function(xhr,status,result){
                console.log("Error: "+xhr.responseText);
            }
        }).done(function(lobby){
            //console.log("Lobby creado "+lobby);
            scene.boton.style.display = 'none';
            scene.listo.style.display = 'inline';

        })
    }

    activoPartida(lobby,scene,callback){
        $.ajax({
            method: "PUT",
            url: 'http://'+location.host+'/activo/',
            data: JSON.stringify(lobby),
            processData: false,
            headers: {
                "Content-Type": "application/json"
            },error: function(xhr,status,result){
                console.log("Error: "+xhr.responseText);
            }
        }).done(function(lobby){

        })
    }

    recogerInfoLobby(callback){
        $.ajax({
            url: 'http://'+location.host+'/lobby/'+this.code
        }).done(function(lobby){
            callback(lobby);
        })
    }

    almacenaInfoLobby(){
        //console.log(this.conexion)
        var escena = this;
        if(this.lobbyCreado) {
            this.recogerInfoLobby(function(lobby){
                escena.numeroActivos = lobby.numeroActivos;
                escena.idJ2 = lobby.idP2;
            });
        }

        if(escena.numeroActivos == 2){
            var msg = {
                type: 'start',
                id: escena.idJ2
            }
            this.conexion.send(JSON.stringify(msg));
        }
        
    }
}