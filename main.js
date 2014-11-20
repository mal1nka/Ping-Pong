﻿
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
        this.rightPlayer = new Rectangle("#fff", this.game.width - 30, this.game.height / 2 - 40, 20, 80, this.context);
        this.leftPlayer.scores = 0;
        this.rightPlayer.scores = 0;
        this.ball = new Ball("#fff", 40, this.game.height / 2, 10, this.context);
        this.ball.step = 2;
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
        this.ball.x += this.ball.step;
        this.ball.y += this.ball.step;
    },

    play: function () {
        this.drawGame(); // отрисовываем всё на холсте
        this.updateBallCords(); // обновляем координаты
    }

};

function TextFactory() {
    throw new Error('This absract. The instance shouldn\'t be created');
}

TextFactory.drawText = function (context, textValue, x, y) {
    context.fillText(textValue, x, y);
};








