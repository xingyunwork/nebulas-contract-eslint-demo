'use strict';

var crypto = require('crypto.js');
var lodash = require('lodash.js');

var SampleContract = function () {
};

SampleContract.prototype = {
    init: function (name, count, allocation) {

    },
    testWindow: function () {
        var name = window.name;
    },
    testSetTimeout: function () {

        setTimeout(function () {
        }, 1000);

    },
    testSetInterval: function () {

        setInterval(function () {
        }, 1000);

    },
    testProxy: function () {

        var o = {name: 1};

        var p = new Proxy(o,{
            get: function(target, prop, receiver){
                return target['name'];
            }
        });


    }
};

module.exports = SampleContract;
