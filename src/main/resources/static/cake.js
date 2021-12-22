export default class Cake extends Phaser.GameObjects.Image{
    constructor(scene,x,y,type,idCreation){
        super(scene,x,y,type)

        this.idCreation = idCreation;
    }

    getIdCreation(){
        return this.idCreation;
    }
}