/**
 * Created by dverbovyi on 26.11.14.
 */
function BaseModel() {
    //this.x = 1 - initialize common static properties
}

var p = BaseModel.prototype;

p.initialize = function() {
    console.log('BaseModel init');
};

/**
 * set property in model with value
 *
 * @param key - type string || object
 * @param val
 */
p.set = function(key, val) {
    if (typeof key === 'object') {
       for(var index in key) {
           this[index] = key[index];
       }
    } else {
        this[key] = val;
    }
};

/**
 * get property's value
 *
 * @param key
 * @returns {*}
 */
p.get = function(key) {
    if(!this[key])
        throw new Error('Property '+key+' is not defined!');

    return this[key];
};