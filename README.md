# nebulas-contract-eslint-demo

## Install

```
$ npm install
$ npm run lint
```

#### src/available-libs.js
    4:14  error  Available libraries are crypto.js  nebulas-contract/available-libs

#### src/class-contract.js
    7:18  error  smart contract code must have an init() method  nebulas-contract/contract-init

#### src/function-contract.js
    10:18  error  smart contract code must have an init() method  nebulas-contract/contract-init

#### src/module-exports.js
    1:1  error  `module.exports = ` is necessary inside of contract              nebulas-contract/module-exports
    12:1  error  Unexpected default export statement. Use module.exports instead  nebulas-contract/no-es6-modules

#### src/no-es6.js
    9:21  error  Unallowed use of `Proxy`  nebulas-contract/no-proxy

#### src/no-settimeout.js
    8:9  error  Unexpected setTimeout   nebulas-contract/no-settimeout
    11:9  error  Unexpected setInterval  nebulas-contract/no-settimeout

#### src/no-window.js
    8:20  error  Avoid using window  nebulas-contract/no-window
