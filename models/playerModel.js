/**
 * Created by dverbovyi on 26.11.14.
 */
function PlayerModel() {
    BaseModel.call(this);
    this.initialize();
}

var p = PlayerModel.prototype = BaseModel.prototype;

p.initialize = function() {
    console.log('PlayerModel init');
};

p.d
