'use strict';

var crypto = require('crypto.js');
var lodash = require('lodash.js');

var TestContract = function () {
    LocalContractStorage.defineProperties(this, {
        name: null,
        count: null
    });
};

TestContract.prototype = {
    init: function () {

    },
    testNoWindow: function () {
        var name = window.name;
    },
    testNoSetTimeout: function () {

        setTimeout(function () {
        }, 1000);

        setInterval(function () {
        }, 1000);

    },
    testSetInterval: function () {



    },
    testNoProxy: function () {

        var o = {name: 1};

        var p = new Proxy(o,{
            get: function(target, prop, receiver){
                return target['name'];
            }
        });


    }
};

// module.exports = TestContract;
export default TestContract