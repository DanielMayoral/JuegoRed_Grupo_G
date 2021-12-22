import { heightGame, widthGame } from "./main.js";

export default class ConnectLobby extends Phaser.Scene{
    constructor(){
        super({key: 'ConnectLobby'});
    }

    create(){
        this.noActivo = false;
        this.numeroActivos = 0;
        this.code = 0;
        this.idJ1 = "";
        this.idJ2 = "";
        this.conexion;

        const caja = document.createElement('div')
        caja.className = 'cajita'

        this.boton = document.createElement('button')
        this.boton.id= 'add-button'
        this.boton.innerText = 'Start'

        this.listo = document.createElement('button')
        this.listo.id= 'empezar'
        this.listo.innerText = 'Listo'
        this.listo.style.display = 'none';
        const nombreInput = document.createElement('input')
        nombreInput.type = 'text'
        nombreInput.name = 'value-nombre'

        caja.appendChild(nombreInput)
        caja.appendChild(this.boton)
        caja.appendChild(this.listo)

        var element =  this.add.dom(widthGame/2,heightGame/2+100,caja);
        element.addListener('click');

        var infoLobby = this.time.addEvent({delay: 1000, callback: this.almacenaInfoLobby, callbackScope:this, loop:true});
        var escena = this;

        element.on('click',function(event){
            if(event.target.id === 'add-button'){
                var input = this.getChildByName('value-nombre');
                escena.code = input.value;
                escena.conexion = new WebSocket('ws://'+location.host+'/game/'+escena.code);
                
                escena.time.addEvent({delay: 1000, callback: escena.conectar, callbackScope:escena, loop:false});

                

                
            }else if(event.target.id === 'empezar'){
                //console.log(escena.noActivo);
                if(escena.numeroActivos < 2 && !escena.noActivo){
                    var lobby = {
                        codigo: escena.code,
                        numeroJugadores: 1,
                        numeroActivos: 0,
                        idP1: "",
                        idP2: escena.idJ2
                    };
                    escena.activoPartida(lobby,escena,function(){
                        
                        //escena.codigo.text = "Waiting..."
                    });
                    escena.noActivo = true;
                }else if(escena.numeroActivos < 2 && !escena.noActivo){
                    //escena.codigo.text = "Waiting..."
                }
                
            }
        })
    }

    conectar(){
        var escena = this;
        var msg = {
            type: "id",
            id: ""
        };
        this.conexion.send(JSON.stringify(msg));

        this.conexion.onmessage = function(msg){
            var message = JSON.parse(msg.data)
            
            switch(message.type){
                case 'id':
                    escena.idJ2 = message.id

                    var lobby = {
                        codigo: escena.code,
                        numeroJugadores: 1,
                        numeroActivos: 0,
                        idP1: "",
                        idP2: escena.idJ2
                    };
                    escena.conectarLobby(lobby,escena,function(){
                        
                    });
                    break;
                case 'start':
                    escena.registry.set("conexion",escena.conexion);
                    escena.registry.set("id",escena.idJ1);
                    escena.registry.set("modo","client");
                    escena.scene.start("PlayOnline");
                    escena.scene.stop("Lobby");
                    escena.scene.remove(escena);
                    break;

            }
        }
    }

    conectarLobby(lobby,scene,callback){
        $.ajax({
            method: "PUT",
            url: 'http://'+location.host+'/conectar/',
            data: JSON.stringify(lobby),
            processData: false,
            headers: {
                "Content-Type" : "application/json"
            },error: function(xhr,status,result){
                console.log("Error: "+xhr.responseText);
            }
        }).done(function(lobby){
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
        }).done(function(scene,lobby){
            callback(scene,lobby);
        })
    }

    almacenaInfoLobby(){
        var escena = this;
        if(this.code != 0){
            this.recogerInfoLobby(function(lobby){
                escena.numeroActivos = lobby.numeroActivos;
                escena.idJ1 = lobby.idP1;
            });
        }
    }


}