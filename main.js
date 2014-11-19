
function Base(color, x, y, canvasContext) {
	this.x =x;
	this.y=y;
	this.color=color;
	this.canvasContext = canvasContext;
};

Base.prototype = {
	draw: function() {
		this.canvasContext.fillStyle = this.color; // меняем цвет клеток, fillStyle = color определяет цвет заливки 
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
        canvas.onmousemove = this.playerMove;
        this.play()
        //setInterval(this.play, 1000 / 50);
		//this.drawGame();
		
	},
	initGameObjects: function() {
	// объект который задаёт игровое поле
		this.game = new Rectangle("#000", 0 , 0 , this.width, this.height, this.context);
	// Ракетки-игроки	
		this.ai = new Rectangle("#fff", 10, this.game.height / 2 - 40, 20, 80, this.context);
		this.player = new Rectangle("#fff", this.game.width - 30, this.game.height / 2 - 40, 20, 80, this.context);
	// количество очков
		this.ai.scores = 0;
		this.player.scores = 0;
	 // наш квадратный игровой "шарик"
		this.ball = new Ball("#fff" , 40, this.game.height / 2 - 10, 10, this.context);
	// скорость шарика
        this.ball.vX = 2; // скорость по оси х
        this.ball.vY = 2; // скорость по оси у


	},
	drawGame: function() {
		this.game.draw(); // рисуем игровое поле
		// рисуем на поле счёт
		this.context.font = 'bold 128px courier';
		this.context.textAlign = 'center';
		this.context.textBaseline = 'top';
		this.context.fillStyle = '#ccc';
		TextFactory.drawText(this.context, this.ai.scores, 100, 0);
		TextFactory.drawText(this.context, this.player.scores, this.game.width-100, 0); 
		for (var i = 25; i < this.game.height; i += 45) // линия разделяющая игровое поле на две части
		   {
				var dot = new Ball("#ccc", this.game.width/2 - 10, i, 10, this.context);
				dot.draw();
			}
		this.ai.draw(); // рисуем левого игрока
		this.player.draw();// правого игрока
		this.ball.draw();// шарик
	},

    playerMove: function (e) {
        var y = e.pageY;
        if (this.player.height / 2 + 10 < y && y < this.game.height - this.player.height / 2 - 10) {
            this.player.y = y - this.player.height / 2;
        }
    },

    // Изменения которые нужно произвести
    update: function () {
        // меняем координаты шарика
        this.ball.x += this.ball.vX;
        this.ball.y += this.ball.vY;

    },

    play: function() {
        this.drawGame(); // отрисовываем всё на холсте
        this.update(); // обновляем координаты
    }

};

function TextFactory() {
	throw new Error('This absract. The instance shouldn\'t be created');
}

TextFactory.drawText = function(context, textValue, x, y) {
	context.fillText(textValue, x, y);
};








