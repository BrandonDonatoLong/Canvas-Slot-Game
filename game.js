var imageRepository = new function(){

    var createImage = function(src) {
        var img = new Image();
        img.src = src;
        return img;
    };
    this.creditMeter = createImage("../images/creditMeter.png");
    this.background = createImage("../images/background_frame.png");
    this.reelBackground = createImage("../images/Combined Reel.png");
    //create Math Symbols
    this.symA = createImage("../images/symbols/wild.png");
    this.symB = createImage("../images/symbols/sapphire7.png");
    this.symC = createImage("../images/symbols/ruby7.png");
    this.symD = createImage("../images/symbols/emerald7.png");
    this.symE = createImage("../images/symbols/bar7.png");
    this.symF = createImage("../images/symbols/bar.png");
    this.symG = createImage("../images/symbols/cherry.png");
    this.symH = createImage("../images/symbols/ace.png");
    this.symI = createImage("../images/symbols/king.png");
    this.symJ = createImage("../images/symbols/queen.png");
    this.symK = createImage("../images/symbols/jack.png");

};

var game = new Game();

function init() {
    if (game.init()){
        game.start();
    }
}

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions.
 */
function Drawable() {
    this.init = function(x, y) {
        // Default variables
        this.x = x;
        this.y = y;
    };

    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    // Define abstract function to be implemented in child objects
    this.draw = function() {
    };
}


/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function reelObject() {
    //this.speed = 1; // Redefine speed of the background for panning
    this.imageIndex = 0;
    this.reelSymbols = [];
    this.stoppedSymbols = [];
    // Implement abstract function
    this.draw = function() {
        // Pan background
        this.y += this.speed;
        this.symbolHeight = this.canvasHeight/3;
        //this is the static background images, redrawn
        this.context.drawImage(imageRepository.reelBackground,0,0,
                    imageRepository.reelBackground.width,
                    imageRepository.reelBackground.height,
                    0,0, this.canvasWidth, this.canvasHeight);

        //Draw another image at the top edge of the first image
        //if the +1 will be greater than 29
        if (this.imageIndex+1 == this.reelSymbols.length)
        {
            //preload a higher image
            this.context.drawImage(this.reelSymbols[1],
                this.x, //image crop x
                this.y - (this.symbolHeight*2),
                this.canvasWidth-4,
                this.symbolHeight);
            //these are the three images displayed when stopped.
            this.context.drawImage(this.reelSymbols[0],
                this.x, //image crop x
                this.y - this.symbolHeight,
                this.canvasWidth-4,
                this.symbolHeight);
            this.context.drawImage(this.reelSymbols[this.imageIndex],
                this.x, this.y, //image crop y
                this.canvasWidth-4, //width of the image
                this.symbolHeight);//height of the image;
            this.context.drawImage(this.reelSymbols[this.imageIndex-1],
                this.x, //image crop x
                this.y + this.symbolHeight,
                this.canvasWidth-4,
                this.symbolHeight);
        }
        //if the -1 will equal 0
        else if (this.imageIndex == 0)
        {

            // index - 1
            this.context.drawImage(this.reelSymbols[this.imageIndex+2],
                this.x, //image crop x
                this.y - (this.symbolHeight*2),
                this.canvasWidth-4,
                this.symbolHeight);
            this.context.drawImage(this.reelSymbols[this.imageIndex+1],
                this.x, //image crop x
                this.y - this.symbolHeight,
                this.canvasWidth-4,
                this.symbolHeight);
            this.context.drawImage(this.reelSymbols[this.imageIndex], this.x,
                this.y, //image crop y
                this.canvasWidth-4, //width of the image
                this.symbolHeight);//height of the image;
            this.context.drawImage(this.reelSymbols[this.reelSymbols.length-1],
                this.x, //image crop x
                this.y + this.symbolHeight,
                this.canvasWidth-4,
                this.symbolHeight);
        }
        else
        {
            if (this.imageIndex+2 > this.reelSymbols.length-1)
            {
                this.context.drawImage(this.reelSymbols[0],
                    this.x, //image crop x
                    this.y - (this.symbolHeight * 2),
                    this.canvasWidth - 4,
                    this.symbolHeight);
            }
            else {
                this.context.drawImage(this.reelSymbols[this.imageIndex + 2],
                    this.x, //image crop x
                    this.y - (this.symbolHeight * 2),
                    this.canvasWidth - 4,
                    this.symbolHeight);
            }
            this.context.drawImage(this.reelSymbols[this.imageIndex+1],
                this.x, this.y - this.symbolHeight,
                this.canvasWidth-4,
                this.symbolHeight);
            this.context.drawImage(this.reelSymbols[this.imageIndex], this.x,
                this.y, //image crop y
                this.canvasWidth-4, //width of the image
                this.symbolHeight);//height of the image;
            this.context.drawImage(this.reelSymbols[this.imageIndex-1],
                this.x, this.y +this.symbolHeight,
                this.canvasWidth-4,
                this.symbolHeight);
        }


        // If the image scrolled off the reel, reset
        if (this.y >= this.canvasHeight-this.symbolHeight) {
            if (this.imageIndex < this.reelSymbols.length - 1) {
                this.imageIndex++;
            }
            else {
                this.imageIndex = 0;
            }
            this.y = this.symbolHeight;
        }
    };

    this.stop = function(){
        this.speed=0;
        this.y=this.symbolHeight;
        if (this.imageIndex+1 == this.reelSymbols.length) {
            this.context.drawImage(this.reelSymbols[0],
                this.x,
                this.y - this.symbolHeight,
                this.canvasWidth - 4,
                this.symbolHeight);
            //record what symbol it has stopped on.
            this.stoppedSymbols[0] = this.reelSymbols[0].src;
        }
        else {
            this.context.drawImage(this.reelSymbols[this.imageIndex + 1],
                this.x, //image crop x
                this.y - this.symbolHeight,
                this.canvasWidth - 4,
                this.symbolHeight);
            //record what symbol it stopped on.
            this.stoppedSymbols[0] = this.reelSymbols[this.imageIndex+1].src;
        }
        this.context.drawImage(this.reelSymbols[this.imageIndex],
            this.x,
            this.y,
            this.canvasWidth-4, //width of the image
            this.symbolHeight); //height of the image
            //record what symbol it stopped on.
            this.stoppedSymbols[1] = this.reelSymbols[this.imageIndex].src;
        if (this.imageIndex == 0)
        {
            this.context.drawImage(this.reelSymbols[this.reelSymbols.length-1],
                this.x,
                this.y + this.symbolHeight,
                this.canvasWidth - 4,
                this.symbolHeight);
            //record the symbol it stopped on
            this.stoppedSymbols[2] = this.reelSymbols[this.reelSymbols.length-1].src;
        }
        else {
            this.context.drawImage(this.reelSymbols[this.imageIndex - 1],
                this.x,
                this.y + this.symbolHeight,
                this.canvasWidth - 4,
                this.symbolHeight);
            //record the symbol it stopped on
            this.stoppedSymbols[2] = this.reelSymbols[this.imageIndex-1].src;
        }
    };
}
// Set Background to inherit properties from Drawable
reelObject.prototype = new Drawable();


/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function credit() {
    //this.speed = 1; // Redefine speed of the background for panning
    this.value = 0;
    // Implement abstract function
    this.draw = function() {
        this.context.drawImage(imageRepository.creditMeter, 0,0,
            imageRepository.creditMeter.width,
            imageRepository.creditMeter.height,
            0, 0,
            this.canvasWidth,
            this.canvasHeight);
        this.context.font = "20px Arial";
        this.context.fillText(this.value.toString(),5,20, 75)
    };
}
// Set Background to inherit properties from Drawable
credit.prototype = new Drawable();

function Game() {

    this.reelOneSymbols = [];
    this.reelTwoSymbols = [];
    this.reelThreeSymbols = [];
    this.reelFourSymbols = [];
    this.reelFiveSymbols = [];
    this.reelsSpinning = false;
    this.reelBank = [];
        //initialization function
    this.init = function () {
        //automatically add credits because online games can't accept money
        var creditMeterCanvas = document.getElementById('creditMeter');
        if (creditMeterCanvas .getContext) {
            credit.prototype.canvasHeight = creditMeterCanvas.height;
            credit.prototype.canvasWidth = creditMeterCanvas.width;
            this.credits = new credit();
            this.credits.context = creditMeterCanvas.getContext('2d');
            this.credits.value = 10000;
        }

        var betCanvas = document.getElementById('betDisplay');
        if (betCanvas .getContext) {
            credit.prototype.canvasHeight = betCanvas.height;
            credit.prototype.canvasWidth = betCanvas.width;
            this.betDisplay = new credit();
            this.betDisplay.context = betCanvas.getContext('2d');
            this.betDisplay.validBets = [3,6,15,21,30,60 ];
            betCanvas.addEventListener("click", cycleBet(),false);
            this.betDisplay.value = 3;
        }
        var winCanvas = document.getElementById('winDisplay');
        if (winCanvas .getContext) {
            credit.prototype.canvasHeight = winCanvas.height;
            credit.prototype.canvasWidth = winCanvas.width;
            this.winDisplay = new credit();
            this.winDisplay.context = winCanvas.getContext('2d');
            this.winDisplay.value = 0;
        }


        var initSuccessful = false;
        /*this could be where you could load a file to read the xls and get the reels from there. In the interest of time I will not be doing that*/
        this.initReels(/*math.xls*/);
        // Get the canvas element

        //reel one initialization. This could be factored out into a function.
        var reelOneCanvas = document.getElementById('reelOne');
        if(reelOneCanvas.getContext) {
            var reelOneContext = reelOneCanvas.getContext('2d');

            reelObject.prototype.canvasWidth = reelOneCanvas.width;
            reelObject.prototype.canvasHeight = reelOneCanvas.height;
            // Initialize the background object
            var reelOne = new reelObject();
                reelOne.reelSymbols = this.reelOneSymbols;
                reelOne.context = reelOneContext;
                reelOne.speed = 5;
                reelOne.init(0, 0);
            this.reelBank.push(reelOne)
        }
        //reel two initialization
        var reelTwoCanvas = document.getElementById('reelTwo');
        if(reelTwoCanvas.getContext) {
            var reelTwoContext = reelTwoCanvas.getContext('2d');

            reelObject.prototype.canvasWidth = reelTwoCanvas.width;
            reelObject.prototype.canvasHeight = reelTwoCanvas.height;
            // Initialize the background object
             var reelTwo = new reelObject();
            reelTwo.context = reelTwoContext;
            reelTwo.reelSymbols = this.reelTwoSymbols;
            reelTwo.speed = 2;
            reelTwo.init(0, 0);
            this.reelBank.push(reelTwo);
        }
        //reel three initialization
        var reelThreeCanvas = document.getElementById('reelThree');
        if(reelThreeCanvas.getContext) {
            var reelThreeContext = reelThreeCanvas.getContext('2d');

            reelObject.prototype.canvasWidth = reelThreeCanvas.width;
            reelObject.prototype.canvasHeight = reelThreeCanvas.height;
            // Initialize the background object
            var reelThree = new reelObject();
            reelThree.context = reelThreeContext;
            reelThree.reelSymbols = this.reelThreeSymbols;
            reelThree.speed = 3;
            reelThree.init(0, 0);
            this.reelBank.push(reelThree);
        }
        //reel four initialization
        var reelFourCanvas = document.getElementById('reelFour');
        if(reelFourCanvas.getContext) {
            var reelFourContext = reelFourCanvas.getContext('2d');

            reelObject.prototype.canvasWidth = reelFourCanvas.width;
            reelObject.prototype.canvasHeight = reelFourCanvas.height;
            // Initialize the background object
            var reelFour = new reelObject();
            reelFour.context = reelFourContext;
            reelFour.reelSymbols = this.reelFourSymbols;
            reelFour.speed = 4;
            reelFour.init(0, 0);
            this.reelBank.push(reelFour);
        }
        //reel five initialization
        var reelFiveCanvas = document.getElementById('reelFive');
        if(reelFiveCanvas.getContext) {
            var reelFiveContext = reelFiveCanvas.getContext('2d');

            reelObject.prototype.canvasWidth = reelFiveCanvas.width;
            reelObject.prototype.canvasHeight = reelFiveCanvas.height;
            // Initialize the background object
            var reelFive = new reelObject();
            reelFive.context = reelFiveContext;
            reelFive.reelSymbols = this.reelFiveSymbols;
            reelFive.speed = 5;
            reelFive.init(0, 0);
            this.reelBank.push(reelFive);
        }
        //background stuff.
        var bgCanvas = document.getElementById('background');
        if (bgCanvas.getContext) {
            var bgContext = bgCanvas.getContext('2d');
            bgContext.drawImage(imageRepository.background, 0,0,
                        imageRepository.background.width,
                        imageRepository.background.height,
                        0, 0,
                        bgCanvas.width,
                        bgCanvas.height);

            initSuccessful = true;
        }

        return initSuccessful;
    };

    //function starts the game.
    this.start = function() {
        animate();
        for (var i = 0; i < game.reelBank.length; i++)
        {
            game.reelBank[i].stop();
        }
    };

    // This is a massive function to initiate the reel arrays.
    this.initReels = function(){
        // Also in the interest of time I am only going to load 30 symbols per reel. In the absence of a game engine
        // only having 30 symbols per reel may also help with performance.
        this.reelOneSymbols.push(imageRepository.symB);
        this.reelOneSymbols.push(imageRepository.symH);
        this.reelOneSymbols.push(imageRepository.symG);
        this.reelOneSymbols.push(imageRepository.symD);
        this.reelOneSymbols.push(imageRepository.symK);
        this.reelOneSymbols.push(imageRepository.symA);
        this.reelOneSymbols.push(imageRepository.symJ);
        this.reelOneSymbols.push(imageRepository.symE);
        this.reelOneSymbols.push(imageRepository.symF);
        this.reelOneSymbols.push(imageRepository.symD);
        this.reelOneSymbols.push(imageRepository.symJ);
        this.reelOneSymbols.push(imageRepository.symC);
        this.reelOneSymbols.push(imageRepository.symF);
        this.reelOneSymbols.push(imageRepository.symK);
        this.reelOneSymbols.push(imageRepository.symA);
        this.reelOneSymbols.push(imageRepository.symE);
        this.reelOneSymbols.push(imageRepository.symG);
        this.reelOneSymbols.push(imageRepository.symI);
        this.reelOneSymbols.push(imageRepository.symB);
        this.reelOneSymbols.push(imageRepository.symJ);
        this.reelOneSymbols.push(imageRepository.symE);
        this.reelOneSymbols.push(imageRepository.symK);
        this.reelOneSymbols.push(imageRepository.symA);
        this.reelOneSymbols.push(imageRepository.symJ);
        this.reelOneSymbols.push(imageRepository.symC);
        this.reelOneSymbols.push(imageRepository.symH);
        this.reelOneSymbols.push(imageRepository.symF);
        this.reelOneSymbols.push(imageRepository.symI);
        this.reelOneSymbols.push(imageRepository.symA);
        this.reelOneSymbols.push(imageRepository.symJ);
        //reel two symbols
        this.reelTwoSymbols.push(imageRepository.symF);
        this.reelTwoSymbols.push(imageRepository.symK);
        this.reelTwoSymbols.push(imageRepository.symB);
        this.reelTwoSymbols.push(imageRepository.symI);
        this.reelTwoSymbols.push(imageRepository.symE);
        this.reelTwoSymbols.push(imageRepository.symC);
        this.reelTwoSymbols.push(imageRepository.symH);
        this.reelTwoSymbols.push(imageRepository.symF);
        this.reelTwoSymbols.push(imageRepository.symK);
        this.reelTwoSymbols.push(imageRepository.symB);
        this.reelTwoSymbols.push(imageRepository.symI);
        this.reelTwoSymbols.push(imageRepository.symF);
        this.reelTwoSymbols.push(imageRepository.symD);
        this.reelTwoSymbols.push(imageRepository.symE);
        this.reelTwoSymbols.push(imageRepository.symJ);
        this.reelTwoSymbols.push(imageRepository.symC);
        this.reelTwoSymbols.push(imageRepository.symK);
        this.reelTwoSymbols.push(imageRepository.symB);
        this.reelTwoSymbols.push(imageRepository.symH);
        this.reelTwoSymbols.push(imageRepository.symF);
        this.reelTwoSymbols.push(imageRepository.symG);
        this.reelTwoSymbols.push(imageRepository.symK);
        this.reelTwoSymbols.push(imageRepository.symD);
        this.reelTwoSymbols.push(imageRepository.symJ);
        this.reelTwoSymbols.push(imageRepository.symG);
        this.reelTwoSymbols.push(imageRepository.symC);
        this.reelTwoSymbols.push(imageRepository.symH);
        this.reelTwoSymbols.push(imageRepository.symF);
        this.reelTwoSymbols.push(imageRepository.symJ);
        this.reelTwoSymbols.push(imageRepository.symD);
        //reel three symbols
        this.reelThreeSymbols.push(imageRepository.symA);
        this.reelThreeSymbols.push(imageRepository.symH);
        this.reelThreeSymbols.push(imageRepository.symE);
        this.reelThreeSymbols.push(imageRepository.symG);
        this.reelThreeSymbols.push(imageRepository.symB);
        this.reelThreeSymbols.push(imageRepository.symK);
        this.reelThreeSymbols.push(imageRepository.symF);
        this.reelThreeSymbols.push(imageRepository.symJ);
        this.reelThreeSymbols.push(imageRepository.symC);
        this.reelThreeSymbols.push(imageRepository.symG);
        this.reelThreeSymbols.push(imageRepository.symA);
        this.reelThreeSymbols.push(imageRepository.symK);
        this.reelThreeSymbols.push(imageRepository.symE);
        this.reelThreeSymbols.push(imageRepository.symD);
        this.reelThreeSymbols.push(imageRepository.symH);
        this.reelThreeSymbols.push(imageRepository.symF);
        this.reelThreeSymbols.push(imageRepository.symJ);
        this.reelThreeSymbols.push(imageRepository.symC);
        this.reelThreeSymbols.push(imageRepository.symI);
        this.reelThreeSymbols.push(imageRepository.symF);
        this.reelThreeSymbols.push(imageRepository.symJ);
        this.reelThreeSymbols.push(imageRepository.symD);
        this.reelThreeSymbols.push(imageRepository.symH);
        this.reelThreeSymbols.push(imageRepository.symA);
        this.reelThreeSymbols.push(imageRepository.symK);
        this.reelThreeSymbols.push(imageRepository.symB);
        this.reelThreeSymbols.push(imageRepository.symE);
        this.reelThreeSymbols.push(imageRepository.symI);
        this.reelThreeSymbols.push(imageRepository.symG);
        this.reelThreeSymbols.push(imageRepository.symD);
        //reel four symbols
        this.reelFourSymbols.push(imageRepository.symJ);
        this.reelFourSymbols.push(imageRepository.symF);
        this.reelFourSymbols.push(imageRepository.symC);
        this.reelFourSymbols.push(imageRepository.symK);
        this.reelFourSymbols.push(imageRepository.symE);
        this.reelFourSymbols.push(imageRepository.symH);
        this.reelFourSymbols.push(imageRepository.symB);
        this.reelFourSymbols.push(imageRepository.symF);
        this.reelFourSymbols.push(imageRepository.symJ);
        this.reelFourSymbols.push(imageRepository.symD);
        this.reelFourSymbols.push(imageRepository.symK);
        this.reelFourSymbols.push(imageRepository.symG);
        this.reelFourSymbols.push(imageRepository.symI);
        this.reelFourSymbols.push(imageRepository.symC);
        this.reelFourSymbols.push(imageRepository.symK);
        this.reelFourSymbols.push(imageRepository.symD);
        this.reelFourSymbols.push(imageRepository.symH);
        this.reelFourSymbols.push(imageRepository.symF);
        this.reelFourSymbols.push(imageRepository.symI);
        this.reelFourSymbols.push(imageRepository.symB);
        this.reelFourSymbols.push(imageRepository.symJ);
        this.reelFourSymbols.push(imageRepository.symG);
        this.reelFourSymbols.push(imageRepository.symH);
        this.reelFourSymbols.push(imageRepository.symC);
        this.reelFourSymbols.push(imageRepository.symI);
        this.reelFourSymbols.push(imageRepository.symF);
        this.reelFourSymbols.push(imageRepository.symH);
        this.reelFourSymbols.push(imageRepository.symE);
        this.reelFourSymbols.push(imageRepository.symK);
        this.reelFourSymbols.push(imageRepository.symB);
        //reel five symbols
        this.reelFiveSymbols.push(imageRepository.symC);
        this.reelFiveSymbols.push(imageRepository.symK);
        this.reelFiveSymbols.push(imageRepository.symD);
        this.reelFiveSymbols.push(imageRepository.symF);
        this.reelFiveSymbols.push(imageRepository.symB);
        this.reelFiveSymbols.push(imageRepository.symI);
        this.reelFiveSymbols.push(imageRepository.symE);
        this.reelFiveSymbols.push(imageRepository.symH);
        this.reelFiveSymbols.push(imageRepository.symF);
        this.reelFiveSymbols.push(imageRepository.symC);
        this.reelFiveSymbols.push(imageRepository.symJ);
        this.reelFiveSymbols.push(imageRepository.symA);
        this.reelFiveSymbols.push(imageRepository.symF);
        this.reelFiveSymbols.push(imageRepository.symH);
        this.reelFiveSymbols.push(imageRepository.symD);
        this.reelFiveSymbols.push(imageRepository.symG);
        this.reelFiveSymbols.push(imageRepository.symC);
        this.reelFiveSymbols.push(imageRepository.symK);
        this.reelFiveSymbols.push(imageRepository.symE);
        this.reelFiveSymbols.push(imageRepository.symJ);
        this.reelFiveSymbols.push(imageRepository.symC);
        this.reelFiveSymbols.push(imageRepository.symI);
        this.reelFiveSymbols.push(imageRepository.symF);
        this.reelFiveSymbols.push(imageRepository.symJ);
        this.reelFiveSymbols.push(imageRepository.symB);
        this.reelFiveSymbols.push(imageRepository.symE);
        this.reelFiveSymbols.push(imageRepository.symH);
        this.reelFiveSymbols.push(imageRepository.symD);
        this.reelFiveSymbols.push(imageRepository.symG);
        this.reelFiveSymbols.push(imageRepository.symE);

    };

    this.evaluateWin = function(){
        // easy mode. Check center symbol, if the next row center symbol doesn't match, no win. If it does, check third
        // if that matches, check 4th and check 5th. That is for line 1 - right down the center.
        this.winDisplay.value = 0;
        var win = 0;
        if (this.reelBank[0].stoppedSymbols[1] == this.reelBank[1].stoppedSymbols[1] || this.reelBank[1].stoppedSymbols[1] == imageRepository.symA.src) {
            //this is a win at a basic level
            win += this.betDisplay.value;
            if (this.reelBank[1].stoppedSymbols[1] == this.reelBank[2].stoppedSymbols[1] || this.reelBank[2].stoppedSymbols[1] == imageRepository.symA.src) {
                //3 symbols win
                win += this.betDisplay.value * 2;
                if (this.reelBank[2].stoppedSymbols[1] == this.reelBank[3].stoppedSymbols[1] || this.reelBank[3].stoppedSymbols[1] == imageRepository.symA.src) {
                    //four symbol wins
                    win += this.betDisplay.value * 3;
                    if (this.reelBank[3].stoppedSymbols[1] == this.reelBank[4].stoppedSymbols[1] || this.reelBank[4].stoppedSymbols[4] == imageRepository.symA.src) {
                        win += this.betDisplay.value * 4;
                        //all five symbols.
                    }
                }
            }
        }
        //top line win?
        if (this.reelBank[0].stoppedSymbols[0] == this.reelBank[1].stoppedSymbols[0] || this.reelBank[1].stoppedSymbols[0] == imageRepository.symA.src) {
            //this is a win at a basic level
            win += this.betDisplay.value;
            if (this.reelBank[1].stoppedSymbols[0] == this.reelBank[2].stoppedSymbols[0] || this.reelBank[2].stoppedSymbols[0] == imageRepository.symA.src) {
                //3 symbols win
                win += this.betDisplay.value * 2;
                if (this.reelBank[2].stoppedSymbols[0] == this.reelBank[3].stoppedSymbols[0] || this.reelBank[3].stoppedSymbols[0] == imageRepository.symA.src) {
                    //four symbol wins
                    win += this.betDisplay.value * 3;
                    if (this.reelBank[3].stoppedSymbols[0] == this.reelBank[4].stoppedSymbols[0] || this.reelBank[4].stoppedSymbols[0] == imageRepository.symA.src) {
                        win += this.betDisplay.value * 4;
                        //all five symbols.
                    }
                }
            }
        }
        //bottom line win
        if (this.reelBank[0].stoppedSymbols[2] == this.reelBank[1].stoppedSymbols[2] || this.reelBank[1].stoppedSymbols[2] == imageRepository.symA.src) {
            //this is a win at a basic level
            win += this.betDisplay.value;
            if (this.reelBank[1].stoppedSymbols[2] == this.reelBank[2].stoppedSymbols[2] || this.reelBank[2].stoppedSymbols[2] == imageRepository.symA.src) {
                //3 symbols win
                win += this.betDisplay.value * 2;
                if (this.reelBank[2].stoppedSymbols[2] == this.reelBank[3].stoppedSymbols[2] || this.reelBank[3].stoppedSymbols[2] == imageRepository.symA.src) {
                    //four symbol wins
                    win += this.betDisplay.value * 3;
                    if (this.reelBank[3].stoppedSymbols[2] == this.reelBank[4].stoppedSymbols[2] || this.reelBank[4].stoppedSymbols[2] == imageRepository.symA.src) {
                        win += this.betDisplay.value * 4;
                        //all five symbols.
                    }
                }
            }
        }

        if (win != 0) {
            this.winDisplay.value = win;
        }
        else {
            this.winDisplay.value = "Sorry";
            this.lostTimeout = setTimeout(function () {
                game.winDisplay.value = 0;
            }, 5000);
        }
        this.credits.value += win;
        this.credits.draw();
    };

    // stop initiated.
    this.stopInitiated = false;
    //this function is called to check for input to start or stop the reels
    this.reelStartStop = function() {
        if (this.reelsSpinning) {
            if (KEY_STATUS.space == true && !this.stopInitiated) {
                this.stopInitiated = true;
                this.winDisplay.value = 0;
                clearTimeout(this.gameSpinTimeout);
                this.reelBank[0].stop();
                this.reelBank[1].speed += 3;
                //set interval timer and increment a count each call back.
                var bankNumber = 1;
                this.reelStopInterval = setInterval(function(){
                    game.reelBank[bankNumber].stop();
                    if (bankNumber == game.reelBank.length-1)
                    {
                        //when the count is done, release it and stop the interval.
                        game.stopInitiated = false;
                        game.reelsSpinning = false;
                        KEY_STATUS.space = false;
                        clearInterval(game.reelStopInterval);
                        bankNumber = 1;
                        // evaluate win
                        game.evaluateWin();
                    }
                    else
                    {
                        bankNumber+=1;
                        game.reelBank[bankNumber].speed+=3;
                    }
                }, 500);
            }
        }
        else
        {
            if(KEY_STATUS.space == true) {
                if (!this.stopInitiated) {
                    clearTimeout(this.lostTimeout);
                    this.reelsSpinning = true;
                    this.winDisplay.value = "GL;HF!";
                    this.credits.value -= this.betDisplay.value;
                    for(var i = 0; i < this.reelBank.length; i++) {
                        var randomSpeed = ((Math.random() * 10) + 5);
                        this.reelBank[i].speed = randomSpeed < 8 ? 8 : randomSpeed;
                    }
                    this.gameSpinTimeout = setTimeout(function () {
                        KEY_STATUS.space = true;
                    }, 5000);
                    KEY_STATUS.space = false;
                }
                else {
                    KEY_STATUS.space = false;
                }
            }

        }
    }
}

function cycleBet() {
    var betIndex = game.betDisplay.validBets.indexOf(game.betDisplay.value);
    if (betIndex < game.betDisplay.validBets.length-1 && betIndex != -1) {
            game.betDisplay.value = game.betDisplay.validBets[betIndex + 1];
    }
    else
    {
        game.betDisplay.value = game.betDisplay.validBets[0];
    }
}
//Magic functions from the internet that allow me to animate stuff.
// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
    32: 'space'
}

// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/false is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
    // Firefox and opera use charCode instead of keyCode to
    // return which key was pressed.
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
}
/**
 * Sets up the document to listen to onkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets the appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
}
/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a global function and cannot be within an
 * object.
 */
function animate() {
    requestAnimFrame( animate );
    for (var i = 0; i < game.reelBank.length; i++)
    {
        game.reelBank[i].draw();
    }
    game.reelStartStop();
    game.credits.draw();
    game.betDisplay.draw();
    game.winDisplay.draw();
}


/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();