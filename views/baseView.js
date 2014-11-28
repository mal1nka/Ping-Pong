/**
 * Created by dverbovyi on 26.11.14.
 */

/**
 *
 * @param canvasContext
 * @param model - type object
 * @constructor
 */
function BaseView(canvasContext, model) {
    this.canvasContext = canvasContext;
    this.model = model || null;
}

var p = BaseView.prototype;

p.initialize = function() {
    console.log('initialize');
    this.draw();
};

p.draw = function () {
    this.canvasContext.fillStyle = this.model.get('color');
};
