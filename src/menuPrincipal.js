import { heightGame, widthGame } from "./main.js";

export default class menuPrincipal extends Phaser.Scene{
    constructor(){
        super({key: 'cambio'})
    }

    preload(){
        this.load.image('fondo','assets/fondomenuprincipal.png')
        this.load.image('empezar','assets/botones/botonEmpezar.png')
        this.load.audio('mprincipal', 'music/CLASSICA.wav')
    }

    create(){
        this.add.image(0,0,'fondo').setScale(0.5).setOrigin(0,0);
        var music = this.sound.add('mprincipal', {volume: 0.3});
        music.setLoop(true);
        music.play();
        var boton = this.add.image((widthGame/2)-100,(heightGame/4)*3,'empezar').setScale(0.5).setOrigin(0,0);
        boton.setInteractive();
        
        boton.on('pointerdown',()=>{
            this.scene.start('PlayScene');
            music.stop();
        });
    }
}
