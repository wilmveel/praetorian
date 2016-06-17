var Web3 = require('web3');
var TestRPC = require("ethereumjs-testrpc");
var Service = require('../../src/index');


var web3 = new Web3();
var service = new Service(web3);

if(!process.env.PROVIDER) process.env.PROVIDER = 'TEST';

if(process.env.PROVIDER == 'LIVE'){
    var httpProvider = new web3.providers.HttpProvider("http://128.199.53.68:8545");
    web3.setProvider(httpProvider);
}

if(process.env.PROVIDER == 'TEST'){
    var testProvider = TestRPC.provider();
    web3.setProvider(testProvider);
}

module.exports = function (suite) {
    suite.timeout(1000000);

    return {
        init: function (callback) {
            web3.eth.getCoinbase(function (err, coinbase) {
                if(err) return callback(err);
                web3.eth.defaultAccount = coinbase
                callback(null, web3);
            });
        },

        deploy: function (callback) {
            service.init(null ,function(err, app){
                if(err) return console.log(err)
                callback(null, app.services)
            })
        }
    };
};