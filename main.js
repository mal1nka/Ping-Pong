
function Base(color, x, y, canvasContext) {
	this.x =x;
	this.y=y;
	this.color=color;
	this.canvasContext = canvasContext;
};

Base.prototype = {
	draw: function() {
		this.canvasContext.fillStyle = this.color;
	}
};

function Rectangle(color, x, y, width, height, canvasContext){
	this.width = width;
	this.height = height;
	Base.call(this, color, x, y, canvasContext);

};

Rectangle.prototype.draw = function() {
	Base.prototype.draw.call(this);
	this.canvasContext.fillRect(this.x, this.y, this.width, this.height);
};

function Ball(color, x, y, radius, canvasContext){
	this.radius = radius;
	Base.call(this, color, x, y, canvasContext);

};


Ball.prototype.draw = function() {
	Base.prototype.draw.call(this);
	this.canvasContext.beginPath();
	this.canvasContext.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
	this.canvasContext.fill();
	this.canvasContext.lineWidth = 1;
	this.canvasContext.strokeStyle = this.color;
	this.canvasContext.stroke();
};

function Game(height, width) {
	this.height = height;
	this.width = width;
	this.init();
};
Game.prototype = {
	init: function() {
		var canvas = document.getElementById("pong");
		canvas.width = this.width;
		canvas.height = this.height;
		this.context = canvas.getContext('2d');
		this.initGameObjects();
        this.setupEventListener();
        this.drawGame();
        //this.update()

	},
	initGameObjects: function() {
		this.game = new Rectangle("#000", 0 , 0 , this.width, this.height, this.context);
		this.playerLeft = new Rectangle("#fff", 10, this.game.height / 2 - 40, 20, 80, this.context);
		this.playerRight = new Rectangle("#fff", this.game.width - 30, this.game.height / 2 - 40, 20, 80, this.context);
        console.log (this.playerRight)

		this.playerLeft.scores = 0;
		this.playerRight.scores = 0;
        this.speedPlayers = 10;
		this.ball = new Ball("#fff" , 40, this.game.height / 2 - 10, 10, this.context);

        this.ball.vX = 2;
        this.ball.vY = 2;
	},
    setupEventListener: function (){
        document.body.onkeydown = function (e) {
            var player;
            var direction;
            switch (e.keyCode) {
                case 38:
                    player= this.playerRight;
                    direction=-1;
                    break;
                case 40:
                    player=this.playerRight;
                    direction=1;
                    break;
                case 87:
                    player=this.playerLeft;
                    direction=-1;
                    break;
                case 83:
                    player=this.playerLeft;
                    direction=1;
                    break;
                default: return
            }
            this.startPlayerMove(direction, player)
        }.bind(this)
    },
	drawGame: function() {
		this.game.draw();
		this.context.font = 'bold 128px courier';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'top';
		this.context.fillStyle = '#ccc';
		TextFactory.drawText(this.context, this.playerLeft.scores, 100, 0);
		TextFactory.drawText(this.context, this.playerRight.scores, this.game.width-100, 0);
		for (var i = 25; i < this.game.height; i += 45)
		   {
				var dot = new Ball("#ccc", this.game.width/2 - 10, i, 10, this.context);
				dot.draw();
			}
		this.playerLeft.draw();
		this.playerRight.draw();
		this.ball.draw();

	},

    startPlayerMove: function (direction, player) {
        if (player.y > 0 && direction == -1 || player.y + player.height < this.game.height && direction==1) {
            player.y = player.y+direction*this.speedPlayers;
        }
        this.drawGame();
    },


    update: function () {
        this.ball.x += this.ball.vX;
        this.ball.y += this.ball.vY;

    }

};

function TextFactory() {
	throw new Error('This absract. The instance shouldn\'t be created');
}

TextFactory.drawText = function(context, textValue, x, y) {
	context.fillText(textValue, x, y);
};








