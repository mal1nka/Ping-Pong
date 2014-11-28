/**
 * Created by dverbovyi on 26.11.14.
 */
function PlayerView(canvasContext, model) {
    BaseView.call(this, canvasContext, model);
    this.initialize();
}

var p = PlayerView.prototype = BaseView.prototype;

p.initialize = function() {
    console.log('PlayerModel init');
    this.draw();
};

p.draw = function() {
    BaseView.draw.call(this);
    this.canvasContext.fillRect(this.model.get('x'), this.model.get('y'), this.model.get('width'), this.model.get('height'));
};
