'use strict';

var TestContract = function () {
};

TestContract.prototype = {
    init: function () {
        setTimeout(function () {

        }, 1000);
        setInterval(function () {

        }, 1000);
    }
};

module.exports = TestContract;
