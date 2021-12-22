export default class LoadScene extends Phaser.Scene{
    constructor(){
        super({key: 'LoadScene'});
    }

    preload(){
        //load images for main scene
        this.load.image('background','assets/fondomenuprincipal.png');
        this.load.image('logomooncake','assets/logos/logomooncakejuego.png');
        //this.load.image('logocoffee','assets/logos/logocoffeetimegame.png');
        this.load.image('logocoffee','assets/logos/coffeetimelogofinal.png');
		this.load.image('burounkohi','assets/logos/burounkohi.png');
        //game background image
        this.load.image('bckgroundGame','assets/fondopartida.png');

        //button images
        this.load.image('start','assets/botones/botonEmpezar.png');
        this.load.image('backMain','assets/botones/botonMenu.png');
        this.load.image('botonCreditos','assets/botones/botonCreditos.png');
        this.load.image('botonOpciones','assets/botones/botonOpciones.png');
        this.load.image('botonDosJugadores','assets/botones/botonDosJugadores.png');
        this.load.image('botonUnJugador','assets/botones/botonUnJugador.png');
        this.load.image('botonOffline','assets/botones/botonOffline.png');
        this.load.image('botonOnline','assets/botones/botonOnline.png');
        this.load.image('flechaIzqda','assets/botones/flecha1.png');
        this.load.image('flechaDcha','assets/botones/flecha.png');
        this.load.image('botonBase','assets/botones/botonBase.png');

        //player images
        this.load.spritesheet('cursorP1','assets/cursores/puntero.png', {frameWidth:199, frameHeight: 183});
        this.load.spritesheet('cursorP2','assets/cursores/puntero2.png', {frameWidth:199, frameHeight: 183});

        //objects images
        this.load.image('cake1','assets/pasteles/PastelMorado.png');
        this.load.image('cake2','assets/pasteles/PastelVerde.png');
        this.load.image('cake3','assets/pasteles/PastelRosa.png');
        this.load.image('cookie','assets/galletaFinal.png')
        this.load.image('coffee1','assets/cafes/CafeRojo.png');
        this.load.image('coffee2','assets/cafes/CafeVerde.png');
        this.load.image('coffee3','assets/cafes/CafeAzul.png');

        //load main audio
        this.load.audio('mainSound','music/MainMenuMusic.wav');

        //game audio
        this.load.audio('mgame','music/InGameMusic.mp3');

        //this.load.image('tablonClaro','assets/TablonMenuPrincipalClaro.png');
        this.load.image('tablonOscuro','assets/TablonMenuPrincipalOscuro.png')

        this.load.image('menuPausa','assets/MenuPausaPartidaBlanco.png');

		this.load.html('login', 'assets/login.html');
		this.load.html('chatMessage', 'assets/chatMessage.html');
		this.load.html('messages', 'assets/messages.html');

        this.loadFunction();
    }

    create(){
        this.registry.set('controls','mouse');
        this.scene.start('NameScene');
        this.scene.launch('MusicScene');
        this.scene.sendToBack('MusicScene');
    }

    loadFunction(){
        //load bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222,0.8);
        progressBox.fillRect(240,270,320,50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y:height / 2 - 50,
            text: 'Loading...',
            style: {
                font:'20px arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5,0.5);

        var percentText = this.make.text({
            x: width/2,
            y: height/2-5,
            text: '0%',
            style:{
                font: '18px arial',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5,0.5);

        var assetText = this.make.text({
            x:width/2,
            y:height/2+50,
            text:'',
            style:{
                font:'18px arial',
                fil:'#ffffff'
            }
        });
        assetText.setOrigin(0.5,0.5);

        this.load.on('fileprogress',function(file){
            assetText.setText('Loading asset: '+file.key);
        });

        this.load.on('complete',function(){
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }
}