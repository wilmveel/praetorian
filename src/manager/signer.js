var ethereumjsTx = require('ethereumjs-tx');
var ethereumjsUtil = require('ethereumjs-util');

module.exports = function (privateKey) {

    return {

        hasAddress: function (address, callback) {
            callback(null, true)
        },

        signTransaction: function (tx_params, callback) {

            tx_params.gasPrice = '0xBA43B7400';
            tx_params.gasLimit = tx_params.gas;

            console.log(tx_params);

            var tx = new ethereumjsTx(tx_params);
            tx.sign(privateKey);

            var buffer = new Buffer(tx.serialize());
            var signedTx = ethereumjsUtil.bufferToHex(buffer);

            var event = new CustomEvent('web3', {detail: tx_params});
            document.dispatchEvent(event);

            callback(null, ethereumjsUtil.stripHexPrefix(signedTx));
        }
    }
};