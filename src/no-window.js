'use strict';

var TestContract = function () {
};

TestContract.prototype = {
    init: function () {
        var name = window.name;
    }
};

module.exports = TestContract;
