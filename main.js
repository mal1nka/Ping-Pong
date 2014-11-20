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
    playerMoveStep: 40,
    refreshSequence: 20,
    init: function () {
        var canvas = document.getElementById("pong");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
        this.initGameObjects();
        this.setupEventListener();
        setInterval(this.play.bind(this), this.refreshSequence);
    },
    initGameObjects: function () {
        this.game = new Rectangle("#000", 0, 0, this.width, this.height, this.context);
        this.leftPlayer = new Rectangle("#fff", 10, this.game.height / 2 - 40, 20, 80, this.context);
        console.log (this.leftPlayer );
        this.rightPlayer = new Rectangle("#fff", this.game.width - 30, this.game.height / 2 - 40, 20, 80, this.context);
        this.leftPlayer.scores = 0;
        this.rightPlayer.scores = 0;
        this.ball = new Ball("#fff", 40, this.game.height / 2, 10, this.context);
        console.log (this.ball );
        this.ball.stepX = 2;
        this.ball.stepY = 2;
    },
    setupEventListener: function () {
        document.body.onkeydown = this.startPlayerMove.bind(this);
        //document.body.onkeyup = this.startPlayerMove.bind(this);

    },

    drawGame: function () {
        this.game.draw();
        this.context.font = 'bold 128px courier';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        this.context.fillStyle = '#ccc';
        TextFactory.drawText(this.context, this.leftPlayer.scores, 100, 0);
        TextFactory.drawText(this.context, this.rightPlayer.scores, this.game.width - 100, 0);
        for (var i = 25; i < this.game.height; i += 45) {
            var dot = new Ball("#ccc", this.game.width / 2 - 10, i, 10, this.context);
            dot.draw();
        }
        this.leftPlayer.draw();
        this.rightPlayer.draw();
        this.ball.draw();

    },

    startPlayerMove: function (e) {
        var currentPlayer = e.keyCode==38||e.keyCode==40? this.rightPlayer : e.keyCode==87||e.keyCode==83? this.leftPlayer : false;
        var direction = e.keyCode==38||e.keyCode==87? -1: e.keyCode==40||e.keyCode==83? 1 : false;
        if(!currentPlayer&&!direction)
            return;
        if (currentPlayer.y > 0 && direction == -1 || currentPlayer.y + currentPlayer.height < this.game.height && direction == 1) {
            currentPlayer.y = currentPlayer.y + direction * this.playerMoveStep;
        }
        this.drawGame();
    },

    updateBallCords: function () {
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
        if ( (this.collision(this.leftPlayer, this.ball)&& this.ball.stepX <0 )  || (this.collision(this.rightPlayer, this.ball)&& this.ball.stepX>0 )  ) {
            this.ball.stepX = -this.ball.stepX;
        }

        this.ball.x += this.ball.stepX;
        this.ball.y += this.ball.stepY;

    },

    play: function () {
        this.drawGame(); // отрисовываем всё на холсте
        this.updateBallCords(); // обновляем координаты
    },

    collision: function(barrier, ball) {
        if (barrier.x+barrier.width > ball.x-ball.radius &&
            barrier.x <  ball.x + ball.radius &&
            barrier.y+barrier.height > ball.y-ball.radius &&
            barrier.y <  ball.y + ball.radius) {
            return true
        }
        else {
            return false
        }
    },

    startNewRound: function (loserPlayer){
        this.leftPlayer.y = this.game.height / 2 - 40;
        this.rightPlayer.y = this.game.height / 2 - 40;
        this.ball.y = this.game.height / 2;
            if (loserPlayer == this.leftPlayer) {
            this.ball.x = 40;
            this.ball.y = this.game.height / 2;
            this.ball.stepX=2;
            this.ball.stepY=2;
        }
        else {
                this.ball.x = this.game.width - 40;
                this.ball.stepX=-2;
                this.ball.stepY=-2;
            }
    }

};

function TextFactory() {
    throw new Error('This absract. The instance shouldn\'t be created');
}

TextFactory.drawText = function (context, textValue, x, y) {
    context.fillText(textValue, x, y);
};








