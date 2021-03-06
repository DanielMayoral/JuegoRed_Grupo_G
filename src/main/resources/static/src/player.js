export default class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,type){
        super(scene,x,y,type);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.points = 0;

        this.init();

        
    }

    init(){
        this.setBounce(0.2)
        .setCollideWorldBounds(true)
        .setDepth(2);
    }

    addPoint(point){
        this.points += point;
    }

    getPoints(){
        return this.points;
    }

}
