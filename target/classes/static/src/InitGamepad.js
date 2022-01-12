import {widthGame, heightGame} from './main.js';

export default class InitGamepad extends Phaser.Scene{
    constructor(){
        super({key: 'InitGamepad'});
    }
    

    create(){ 
		this.add.image(0, 0, 'background').setOrigin(0, 0);
        //poner selector de controles
        //cuando se seleccione gamepad, si no está inicializado
        //crear ventana que obligue a pulsar al jugador un botón para inicializar el pad
        var text = this.add.text((widthGame/2)-150, heightGame/2, 'Press a button on the Gamepad to use', { font: '20px catCafe', fill: '#fff' }).setOrigin(0,0);


        this.input.gamepad.once('down', function (pad, button, index) {

            text.setText('Playing with ' + pad.id);
    
            this.gamepad = pad;
            this.input.gamepad.start();

            this.deleteScene = this.time.addEvent({delay: 3000, callback: this.delete, callbackScope:this, loop:false});

        }, this);
        
        
    }

    delete(){
        this.registry.set('controls','gamepad');
        this.scene.start('OptionsScene');
        this.scene.stop();
    }
}