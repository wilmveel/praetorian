var compiled = require('../build/contracts.json');

var AccessService = require('./services/AccessService');
var PartyService = require('./services/PartyService');
var ChallengeService = require('./services/ChallengeService');
var LevelService = require('./services/LevelService');

module.exports = function (web3) {

    var abi = JSON.parse(compiled.Factory.interface);
    var code = compiled.Factory.bytecode;
    var factoryContract = web3.eth.contract(abi);

    return {

        init: function (factoryAddress, callback) {

            var gas = compiled.Factory.gasEstimates.creation[1];

            if (factoryAddress) factoryContract.at(factoryAddress, cb);
            else factoryContract.new({gas: (gas * 3), data: code}, cb);

            function cb(err, contract) {
                if (err) return callback(err)
                if (contract.address) {

                    var services = {
                        accessService: new AccessService(contract, compiled.Access),
                        partyService: new PartyService(contract, compiled.Party),
                        challengeService: new ChallengeService(contract, compiled.Challenge),
                        levelService: new LevelService(contract, compiled.Level)
                    };

                    var app = {
                        address: contract.address,
                        compiled: compiled,
                        services: services
                    };

                    callback(null, app)
                }

            }
        }

    }
};