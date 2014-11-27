function Base(color, x, y, canvasContext) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.canvasContext = canvasContext;
}

Base.prototype = {
    draw: function () {
        this.canvasContext.fillStyle = this.color;
    }
};

function Rectangle(color, x, y, width, height, canvasContext) {
    this.width = width;
    this.height = height;
    Base.call(this, color, x, y, canvasContext);

}

Rectangle.prototype.draw = function () {
    Base.prototype.draw.call(this);
    this.canvasContext.fillRect(this.x, this.y, this.width, this.height);
};

function Ball(color, x, y, radius, canvasContext) {
    this.radius = radius;
    Base.call(this, color, x, y, canvasContext);

}


Ball.prototype.draw = function () {
    Base.prototype.draw.call(this);
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvasContext.fill();
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = this.color;
    this.canvasContext.stroke();
};

function Game(height, width) {
    this.height = height;
    this.width = width;
    this.init();
}
Game.prototype = {
    playerStepFactor: 12, // the larger the factor - the smaller step
    playerIndentX: 10,
    playerWidth : 20,
    playerHeight : 80,
    refreshSequence: 5,
    ballRadius: 10,
    beginBallX : 40,
    pause: true,
    isNewRound: true,
    isGameRunning: false,

    init: function () {
        var canvas = document.getElementById("pong");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
        this.initGameObjects();
        this.setupEventListener();
        this.drawGame();
       // this.updateBallCords();
        this.intervalId = setInterval(this.play.bind(this), this.refreshSequence);

    },
    initGameObjects: function () {
        this.game = new Rectangle("#000", 0, 0, this.width, this.height, this.context);
        this.playerMoveStep = this.game.height/this.playerStepFactor;
        this.leftPlayer = new Rectangle("#fff", this.playerIndentX, this.game.height / 2 -  this.playerHeight/2, this.playerWidth, this.playerHeight, this.context);
        this.rightPlayer = new Rectangle("#fff", this.game.width -this.playerIndentX- this.playerWidth, this.game.height / 2 -  this.playerHeight/2, this.playerWidth, this.playerHeight, this.context);
        this.leftPlayer.scores = 0;
        this.rightPlayer.scores = 0;
        this.ball = new Ball("#fff", this.beginBallX, this.game.height / 2, this.ballRadius, this.context);
        this.ball.stepSpeed = 2;
        this.ball.stepX = this.ball.stepSpeed;
        this.ball.stepY = this.ball.stepSpeed;
        this.leftPlayer.canMove = true;
        this.rightPlayer.canMove = false;

    },
    setupEventListener: function () {
        document.body.onkeypress = this.startPlayerMove.bind(this);
        //document.body.onkeyup = this.startPlayerMove.bind(this);

    },

    drawGame: function () {
        this.game.draw();
        TextFactory.setFont(this.context, 'bold 128px courier');
        TextFactory.setTextAlign(this.context,'center');
        TextFactory.setVerticalAlign(this.context, 'top');
        TextFactory.setColor(this.context, 'red');
        TextFactory.drawText(this.context, this.leftPlayer.scores, 100, 0);
        TextFactory.drawText(this.context, this.rightPlayer.scores, this.game.width - 100, 0);
        for (var i = 25; i < this.game.height; i += 45) {
            var dot = new Ball("#ccc", this.game.width / 2, i, 10, this.context);
            dot.draw();
        }
        this.leftPlayer.draw();
        this.rightPlayer.draw();
        this.ball.draw();
        if(this.pause) {
            this.drawFieldSeparation();
        }

    },
    drawFieldSeparation: function(){
        TextFactory.setFont(this.context, 'bold 30px courier');
        TextFactory.setVerticalAlign(this.context, 'middle');
        TextFactory.setColor(this.context, 'red');
        TextFactory.drawText(this.context, "Press Space to start", this.game.width/2 , this.game.height/2);
    },
    startPlayerMove: function (e) {
        if (e.keyCode==32) {
            this.pause = !this.pause;
            if (this.isNewRound) {
                this.leftPlayer.canMove = !this.leftPlayer.canMove ;
                this.rightPlayer.canMove = !this.rightPlayer.canMove;
                this.isNewRound = false;
            }
        }
        var currentPlayer = e.keyCode==91||e.keyCode==39? this.rightPlayer : e.keyCode==119||e.keyCode==115? this.leftPlayer : false;

        var direction = e.keyCode==91||e.keyCode==119? -1: e.keyCode==39||e.keyCode==115? 1 : false;
        if(!currentPlayer&&!direction)
            return;
        if ((!this.pause || this.isNewRound)&& currentPlayer.canMove && (currentPlayer.y > 0 && direction == -1 || currentPlayer.y + currentPlayer.height < this.game.height && direction == 1)) {
            currentPlayer.y = currentPlayer.y + direction * this.playerMoveStep;
              if (this.isNewRound){
                this.ball.y = this.ball.y+direction * this.playerMoveStep;
            }
        }
        this.drawGame();
    },

    updateBallCords: function () {
        if (this.pause == false) {
            // Move to y
            if (this.ball.y - this.ball.radius <= 0 || this.ball.y+this.ball.radius >= this.game.height) {
                this.ball.stepY= -this.ball.stepY;
            }

            // Move to x
            if (this.ball.x-this.ball.radius <= 0) {
                this.rightPlayer.scores ++;
                this.startNewRound(this.leftPlayer);
            }
            if (this.ball.x+this.ball.radius >= this.game.width) {
                this.leftPlayer.scores ++;
                this.startNewRound(this.rightPlayer);
            }

            //collision with player
            if ( (this.collision(this.leftPlayer, this.ball)&& this.ball.stepX <0 )  || (this.collision(this.rightPlayer, this.ball)&& this.ball.stepX>0)  ) {
                this.ball.stepX = -this.ball.stepX;
                if (this.rightPlayer.canMove) {
                    this.leftPlayer.canMove = true;
                    this.rightPlayer.canMove = false;
                }
                else {
                    this.leftPlayer.canMove = false;
                    this.rightPlayer.canMove = true;
                }
            }
            this.ball.x += this.ball.stepX;
            this.ball.y += this.ball.stepY;
        }
    },

    play: function () {
        if (!this.pause) {
            this.drawGame();
            this.updateBallCords();
            this.isGameRunning = true;
        }
        else if (this.pause && this.isGameRunning){
            this.drawFieldSeparation();
            this.isGameRunning = false
        }
    },

    collision: function(barrier, ball) {
        return barrier.x+barrier.width > ball.x-ball.radius &&
            barrier.x <  ball.x + ball.radius &&
            barrier.y+barrier.height > ball.y-ball.radius &&
            barrier.y <  ball.y + ball.radius
    },

    startNewRound: function (loserPlayer){
        this.isNewRound = true;
        this.pause=true;
        this.leftPlayer.y = this.rightPlayer.y= this.game.height / 2 -  this.playerHeight/2;
        this.ball.y = this.game.height / 2;
        if (loserPlayer == this.leftPlayer) {
            this.ball.x = this.beginBallX;
            this.ball.y = this.game.height / 2;
            this.ball.stepX=this.ball.stepY=this.ball.stepSpeed;
        }
        else {
            this.ball.x = this.game.width - this.beginBallX;
            this.ball.stepX=this.ball.stepY=-this.ball.stepSpeed;
        }
        this.drawGame();

    }
};

function TextFactory() {
    throw new Error('This absract. The instance shouldn\'t be created');
}

TextFactory.drawText = function (context, textValue, x, y) {
    context.fillText(textValue, x, y);
};

TextFactory.setFont = function(context, value) {
    context.font = value;
};

TextFactory.setColor = function(context, value) {
    context.fillStyle = value;
};

TextFactory.setVerticalAlign= function(context, value) {
    context.textBaseline = value;
};

TextFactory.setTextAlign= function(context, value) {
    context.textAlign = value;
}








