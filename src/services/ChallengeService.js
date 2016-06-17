var assert = require('assert');
var async = require('async');

var sha3 = require('crypto-js/sha3');
var crypto = require('crypto');
var secp256k1 = require('secp256k1');

var ethereumjsUtil = require('ethereumjs-util');

module.exports = function (factory, contract) {

    var abi = JSON.parse(contract.interface);

    function createPrivateKey(secret, salt) {
        var hash = sha3(secret.toString('hex') + salt.toString('hex'), {outputLength: 256}).toString();
        return new Buffer(hash, 'hex');
    }

    function createSign(secret, contract, callback) {

        async.parallel({
                salt: function (callback) {
                    contract.getSalt(function (err, salt) {
                        if (err) return callback(err);
                        salt = new Buffer(salt.slice(2), 'hex');
                        callback(null, salt);
                    });
                },
                challenge: function (callback) {
                    contract.getChallenge(function (err, challenge) {
                        if (err) return callback(err);
                        challenge = new Buffer(challenge.slice(2), 'hex');
                        callback(null, challenge);
                    });
                }
            },
            function (err, result) {

                if (err) return callback(err);

                var privateKey = createPrivateKey(secret, result['salt']);
                var sign = secp256k1.sign(result['challenge'], privateKey);

                var v = sign.recovery + 27;
                var r = '0x' + sign.signature.slice(0, 32).toString('hex');
                var s = '0x' + sign.signature.slice(32, 64).toString('hex');

                callback(null, {v: v, r: r, s: s}, result['salt'], result['challenge'])
            });

    }

    return {

        list: function (callback) {
            factory.getChallenges(function (err, challenges) {
                if (err) return callback(err);
                challenges = challenges.map(function(x){
                    var buffer = new Buffer(x.slice(2), 'hex')
                    return buffer.toString('utf8').replace(/\0/g, '');
                });
                callback(null, challenges)
            });
        },

        create: function (secret, callback) {

            var salt = crypto.randomBytes(32);
            var privateKey = createPrivateKey(secret, salt);
            var response = ethereumjsUtil.privateToAddress(privateKey);

            factory.createPasswordChallenge.estimateGas(function (err, gas) {
                if (err) return callback(err);
                factory.createPasswordChallenge('0x' + response.toString('hex'), '0x' + salt.toString('hex'), {
                    gas: (gas * 2)
                }, function (err, transactionHash) {
                    if (err) return callback(err);
                    var events = factory.allEvents();
                    events.watch(function (err, event) {
                        if (err) return callback(err);
                        if (event && event.transactionHash == transactionHash) {
                            events.stopWatching();
                            callback(null, event.args.addr)
                        }
                    });
                });
            });
        },

        verify: function (address, secret, callback) {
            factory._eth.contract(abi).at(address, function (err, contract) {
                if (err) callback(err)
                else if (contract.address) {
                    createSign(secret, contract, function (err, sign) {
                        if (err) return callback(err);
                        contract.verify.estimateGas(function (err, gas) {
                            if (err) return callback(err);
                            contract.verify(sign.v, sign.r, sign.s, {
                                gas: (gas * 2)
                            }, function (err, transactionHash) {
                                if (err) return callback(err);
                                var events = contract.allEvents();
                                events.watch(function (err, event) {
                                    if (err) return callback(err);
                                    if (event && event.transactionHash == transactionHash) {
                                        events.stopWatching();
                                        callback(null, event.event)
                                    }
                                });
                            });
                        });
                    });
                }
            });
        },

        change: function (address, oldPassword, newPassword, callback) {

            factory._eth.contract(abi).at(address, function (err, contract) {
                if (err) callback(err)
                else if (contract.address) {

                    createSign(oldPassword, contract, function (err, sign, salt, challenge) {
                        if (err) return callback(err);

                        var privateKey = createPrivateKey(newPassword, salt);
                        var response = ethereumjsUtil.privateToAddress(privateKey);

                        contract.verify.estimateGas(function (err, gas) {
                            if (err) return callback(err);
                            contract.change(sign.v, sign.r, sign.s, '0x' + response.toString('hex'), {
                                gas: (gas * 2)
                            }, function (err, transactionHash) {
                                if (err) return callback(err);
                                var events = contract.allEvents();
                                events.watch(function (err, event) {
                                    if (err) return callback(err);
                                    if (event && event.transactionHash == transactionHash) {
                                        events.stopWatching();
                                        callback(null, event.event)
                                    }
                                });
                            });
                        });
                    });
                }
            });
        },

        authorize: function (address, secret, callback) {

            factory._eth.contract(abi).at(address, function (err, contract) {
                if (err) callback(err)
                else if (contract.address) {
                    createSign(secret, contract, function (err, sign) {
                        if (err) return callback(err);
                        contract.auth.estimateGas(function (err, gas) {
                            if (err) return callback(err);
                            contract.auth(sign.v, sign.r, sign.s, {
                                gas: (gas * 2)
                            }, function (err, transactionHash) {
                                if (err) return callback(err);
                                var events = contract.allEvents();
                                events.watch(function (err, event) {
                                    if (err) return callback(err);
                                    if (event && event.transactionHash == transactionHash) {
                                        events.stopWatching();
                                        callback(null, event.event)
                                    }
                                });
                            });
                        });
                    });
                }
            });
        }
    }
};