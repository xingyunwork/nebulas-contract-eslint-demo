'use strict';

var TestContract = function () {

    LocalContractStorage.defineMapProperty(this, "allocation");

    LocalContractStorage.defineMapProperty(this, "allocation");


    LocalContractStorage.defineProperties(this, {
        name: null,
        count: null
    });


    LocalContractStorage.defineMyProperties(this, {
        name: null,
        count: null
    });
    LocalContractStorage.defineMapMyProperty(this, "allocation");


    LocalContractStorage.defineMapProperty(this, {
        name: {

        },
        count: {

        }
    });

};

TestContract.prototype = {
    init: function () {
    }
};

module.exports = TestContract;
