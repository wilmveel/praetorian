module.exports = function (factory, contract) {

    var abi = JSON.parse(contract.interface);

    var hexToString = function(hex){
        return new Buffer(hex.slice(2), 'hex').toString('utf8').replace(/\0/g, '');
    };

    return {

        list: function (callback) {
            factory.getParties(function(err, parties){
                callback(err, parties);
            });
        },

        get: function (address, callback) {

            factory._eth.contract(abi).at(address, function (err, contract) {
                if (err) return callback(err)
                else if (contract.address) {

                    contract.get(function(err, res){
                        if(err) return callback(err);
                        callback(null, {
                            name: hexToString(res[0]),
                            challenges: res[1].map(function(x){
                                return hexToString(x);
                            })
                        });

                    });

                }
            });
        },


        create: function (name, callback) {
            factory.createParty.estimateGas(name, function (err, gas) {
                if (err) return callback(err);
                factory.createParty(name, {
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
                })
            });
        }
    }
};