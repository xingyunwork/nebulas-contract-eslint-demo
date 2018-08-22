'use strict';

var Coin = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.name = obj.name;
        this.count = obj.count;
    } else {
        this.name = "";
        this.count = new BigNumber(0);
    }
}

Coin.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
}

var CoinPrice = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.name = obj.name;
        this.price = obj.price;
        this.rate = obj.rate;
    } else {
        this.name = "";
        this.price = new BigNumber(0);
        this.rate = new BigNumber(0);
    }
}

CoinPrice.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
}

var CoinArray = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.coins = obj.coins;
    } else {
        this.coins = new Array();
    }
}

CoinArray.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
}

var User = function(text) {
    p = {
        get name(){
            // no returns.
        }
    };

    if (text) {
        var obj = JSON.parse(text);
        this.num = obj.num;
        this.round = obj.round;
        this.address = obj.address;
        this.balance = obj.balance;
        this.coinList = obj.coinList;
    } else {
        this.num = "";
        this.address = "";
        this.round = "";
        this.balance = new BigNumber(0);
        this.coinList = new Array();
    }

}

User.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
}

var Rank = function(text) {
    if (text) {
        var obj = JSON.parse(text);
        this.users = obj.users;
    } else {
        this.users = new Array();
    }
}

Rank.prototype = {
    toString: function() {
        return JSON.stringify(this);
    }
}

var Trade = function() {
    LocalContractStorage.defineProperties(this, {
        _owner: null,
        // 比赛轮次
        _round: {
            parse: function(value) {
                return parseInt(value);
            },
            stringify: function(o) {
                return o.toString(10);
            }
        },
        // 手续费
        _charge: {
            parse: function(value) {
                return new BigNumber(value);
            },
            stringify: function(o) {
                return o.toString(10);
            }
        },
        //初始资金
        _balance: {
            parse: function(value) {
                return new BigNumber(value);
            },
            stringify: function(o) {
                return o.toString(10);
            }
        },
        //数字货币列表
        _coinArray: {
            parse: function(value) {
                return new CoinArray(value);
            },
            stringify: function(o) {
                return o.toString(10);
            }
        }
    });

    LocalContractStorage.defineMapProperties(this, {
        //存储用户信息
        "users": {
            parse: function(value) {
                return new User(value);
            },
            stringify: function(o) {
                return o.toString(10);
            }
        },
        // 存储币种信息
        "coins": {
            parse: function(value) {
                return new CoinPrice(value);
            },
            stringify: function(o) {
                return o.toString();
            }
        },
        // 定位用户的币种位置
        "location": {
            parse: function(value) {
                return parseInt(value);
            },
            stringify: function(o) {
                return o.toString();
            }
        },
        "rankList": {
            parse: function(value) {
                return new Rank(value);
            },
            stringify: function(o) {
                return o.toString(10);
            }
        }
    });
};

Trade.prototype = {
    init: function() {
        var from = Blockchain.transaction.from;
        this._owner = from;
        this._round = 1;
        this._charge = 0.015;
        this._balance = 10000;
        this._coinArray = new CoinArray();
        this.rankList.set(this._round, new Rank())
    },

    newRound: function() {
        var from = Blockchain.transaction.from;
        if (from != this._owner) {
            throw new Error("no right!")
        }
        this._round = this._round + 1;
        this.rankList.set(this._round, new Rank())
        return this._round;
    },

    //更新手续费
    updateCharge: function(newCharge) {
        var from = Blockchain.transaction.from;
        if (from != this._owner) {
            throw new Error("no right!")
        }
        this._charge = newCharge;
        return this._charge;
    },

    //更新初始资金
    updateBalance: function(newBalance) {
        var from = Blockchain.transaction.from;
        if (from != this._owner) {
            throw new Error("no right!")
        }
        this._balance = newBalance;
        return this._balance;
    },

    // 更新币价
    updateCoin: function(dataList) {

        var from = Blockchain.transaction.from;
        if (from != this._owner) {
            throw new Error("no right!")
        };
        var coinList = this._coinArray;
        for (var coin of dataList) {
            var coinName = coin.name;
            var updateCoin = this.coins.get(coinName);
            if (!updateCoin) {
                coinList.coins.push(coinName);
                updateCoin = new CoinPrice();
            }
            updateCoin.name = coin.name;
            updateCoin.price = coin.price;
            updateCoin.rate = coin.rate;

            this.coins.set(coinName, updateCoin);
        }
        this._coinArray = coinList;
        return 1;

    },

    //查询币价
    searchCoin: function() {
        var coinList = this._coinArray;
        var result = new Array();
        for (var coinName of coinList.coins) {
            var coin = this.coins.get(coinName)
            result.push(coin);
        }
        return result;
    },

    // 注册获取资金
    register: function() {
        var from = Blockchain.transaction.from;
        var user = this.users.get(from);
        if (user && parseInt(user.round) == this._round) {
            throw new Error("You have registered")
        }
        var rl = this.rankList.get(this._round)
        user = new User();
        var num = rl.users.length
        user.balance = this._balance;
        user.num = num;
        user.round = this._round;
        user.address = from;
        this.users.set(from, user);
        rl.users.push(user);
        this.rankList.set(this._round, rl)
        return num;
    },

    //买入币
    buyCoin: function(coinName, coinCount) {
        var from = Blockchain.transaction.from;
        var user = this.users.get(from);
        if (!user) {
            throw new Error("No user");
        }
        var round = user.round;
        if (parseInt(round) != this._round) {
            throw new Error("new Round, please register again!");
        }
        var coinValue = new BigNumber(this.coins.get(coinName).price);
        if (coinValue == null) {
            throw new Error("Invalid coin");
        }
        var balance = user.balance;
        var amount = new BigNumber(coinValue).mul(new BigNumber(coinCount));
        if (new BigNumber(balance).lt(amount)) {
            throw new Error('Insufficient balance')
        }
        balance = new BigNumber(balance).sub(amount);

        var coinList = user.coinList;
        var locateText = from + coinName + this._round;
        var coinId = this.location.get(locateText);
        if (coinId == null) {
            var num = coinList.length;
            var coin = new Coin();
            coin.name = coinName;
            coin.count = new BigNumber(coinCount);
            coinList.push(coin);
            this.location.set(locateText, num)
        } else {
            var coin = coinList[coinId];
            coin.count = new BigNumber(coin.count).plus(new BigNumber(coinCount));
            coinList[coinId] = coin;
        }

        user.coinList = coinList;
        user.balance = balance;
        this.users.set(from, user);
        var rl = this.rankList.get(this._round);
        rl.users[parseInt(user.num)] = user;
        this.rankList.set(this._round, rl)
        return 1;
    },

    // 卖出币
    sellCoin: function(coinName, coinCount) {
        var from = Blockchain.transaction.from;
        var coinValue = new BigNumber(this.coins.get(coinName).price);
        if (coinValue == null) {
            throw new Error("Invalid coin")
        }
        var user = this.users.get(from);
        if (!user) {
            throw new Error("No user");
        }
        var round = user.round;
        if (parseInt(round) != this._round) {
            throw new Error("new Round, please register again!");
        }
        var locateText = from + coinName + this._round;
        var coinId = this.location.get(locateText);
        if (coinId == null) {
            throw new Error("no Coin");
        }
        var coin = user.coinList[coinId];
        var count = coin.count;
        if (new BigNumber(count).lt(new BigNumber(coinCount))) {
            throw new BigNumber("Insufficient coin")
        }

        var amount = new BigNumber(coinValue).mul(new BigNumber(coinCount));
        user.balance = amount.mul(new BigNumber(1).sub(new BigNumber(this._charge))).plus(user.balance);
        coin.count = new BigNumber(count).sub(coinCount);
        user.coinList[coinId] = coin;
        this.users.set(from, user);
        var rl = this.rankList.get(this._round);
        rl.users[parseInt(user.num)] = user;
        this.rankList.set(this._round, rl)
        return 1;
    },

    //查询全局信息
    searchInfo: function() {
        var result = {
            charge: this._charge,
            balance: this._balance,
            round: this._round,
            coinList: this._coinArray.coins
        }
        return result;
    },

    //查询用户信息
    searchUser: function(address) {
        var from = address;
        if (!address) {
            from = Blockchain.transaction.from;
        }
        var user = this.users.get(from);
        if (user && parseInt(user.round) == this._round) {
            return user
        } else {
            return null
        }
    },

    //查询用户列表
    searchRank: function(round) {
        var newRound = round
        if (!round) {
            newRound = this._round
        }
        return this.rankList.get(newRound).users;
    }

};

module.exports = Trade;