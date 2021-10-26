import { heightGame, widthGame } from "./main.js";

export default class menuPrincipal extends Phaser.Scene{
    constructor(){
        super({key: 'cambio'})
    }

    preload(){
        this.load.image('fondo','assets/fondomenuprincipal.png')
        this.load.image('empezar','assets/botonEmpezar.png')
    }

    create(){
        this.add.image(0,0,'fondo').setScale(0.5).setOrigin(0,0);
        var boton = this.add.image((widthGame/2)-100,(heightGame/4)*3,'empezar').setScale(0.5).setOrigin(0,0);
        boton.setInteractive();
        
        boton.on('pointerdown',()=>{this.scene.start('PlayScene')});
    }
}