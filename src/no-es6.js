'use strict';

var TestContract = function () {
};

TestContract.prototype = {
    init: function () {
        var o = {name: 1};
        var p = new Proxy(o,{
            get: function(target, prop, receiver){
                return target['name'];
            }
        });
    }
};

module.exports = TestContract;
