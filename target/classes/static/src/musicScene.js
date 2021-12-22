export default class MusicScene extends Phaser.Scene{
    constructor(){
        super({key:'MusicScene'});
    }

    create(){
        this.music = this.sound.add('mainSound', { volume: 0.3 });
		this.music.setLoop(true);
		this.music.play();
    }
    startMusic(){
		this.music.play();
    }
	stopMusic(){
		this.music.stop();
	}
    setVolumen(volumen){
        this.music.setVolume(volumen);
    }
}