'use strict';

var TestContract = function () {
};

TestContract.prototype = {
    init: function () {

    },
    // A for loop with a stop condition that can never be reached
    forRule: function () {
        // Fail
        for (var i = 0; i < 10; i--) {
        }

        for (var i = 10; i >= 0; i++) {
        }

        // Pass
        for (let i = 0; i < 10; i++) {
            console.log(i);
        }
    },
    // This rule enforces that a return statement is present in property getters.
    getterReturnRule: function () {
        // Fail
        p = {
            get name(){
                // no returns.
            }
        };

        Object.defineProperty(p, "age", {
            get: function (){
                // no returns.
            }
        });

        class P{
            get name(){
                // no returns.
            }
        }

        // Pass
        var p = {
            get name(){
                return "nicholas";
            }
        };

        Object.defineProperty(p, "age", {
            get: function (){
                return 17;
            }
        });
    }
};

module.exports = TestContract;
