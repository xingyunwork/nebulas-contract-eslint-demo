'use strict';

var TestContract = function () {
    LocalContractStorage.defineProperties(this, {
        name: null,
        count: null
    });

    LocalContractStorage.defineMapProperty(this, "allocation");

    LocalContractStorage.defineMapProperty(this, "allocation");


    LocalContractStorage.defineMyProperties(this, {
        name: null,
        count: null
    });
    LocalContractStorage.defineMapMyProperty(this, "allocation");

};

TestContract.prototype = {
    init: function () {
    }
};

module.exports = TestContract;
