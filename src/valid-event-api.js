'use strict';

var TestContract = function () {
};

TestContract.prototype = {
    init: function () {
    },
    transfer: function (address, value) {
        Event.trigger("transfer", {
            Transfer: {
                from: Blockchain.transaction.to,
                to: address,
                value: value
            }
        });
    },
};

module.exports = TestContract;
