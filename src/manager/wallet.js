var ethereumjsWallet = require('ethereumjs-wallet');
var HookedWeb3Provider = require('hooked-web3-provider');

var Signer = require('./signer');

module.exports = function (web3, privateKey) {

    var wallet = null;

    if (!privateKey)
        wallet = ethereumjsWallet.generate();
    else
        wallet = ethereumjsWallet.fromPrivateKey(new Buffer(privateKey, 'hex'));


    var walletAddress = '0x' + wallet.getAddress().toString('hex')



    return {
        init: function(callback){
            web3.eth.getBalance(walletAddress, function (err, balance) {
                console.log('balance', balance.toString(10))
                if (balance.toString(10) < 5000000000000000000) {
                    console.log('Send ether')
                    var transaction = {
                        from: web3.eth.coinbase,
                        to: '0x' + wallet.getAddress().toString('hex'),
                        value: web3.toWei(5, "ether"),
                        gas: 50000
                    };
                    console.log('transaction', transaction)
                    web3.eth.sendTransaction(transaction, function (err, data) {
                        var filter = web3.eth.filter("latest");
                        filter.watch(function (err, log) {
                            web3.eth.getTransaction(data, function (err, t) {
                                console.log("watch", t);
                                if (t && t.blockHash) {
                                    filter.stopWatching();
                                    callback();
                                }
                            });

                        });
                    });
                }else{
                    callback();
                }

            });
        },
        getAddress: function () {
            return walletAddress
        },
        getPrivateKey: function () {
            return wallet.getPrivateKey().toString('hex');
        },
        getProvider: function () {
            var hookedWeb3Provider = new HookedWeb3Provider({
                host: "/web3",
                transaction_signer: new Signer(wallet.getPrivateKey())
            });
            return hookedWeb3Provider;
        }
    }

};
