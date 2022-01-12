export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,type){
        super(scene,x,y,type);

        this.scene = scene;
        this.scene.add.existing(this);

        this.puntos = 0;
        
    }

    sumarPuntos(puntos){
        this.puntos += puntos;
    }

    getPuntos(){
        return this.puntos;
    }


}