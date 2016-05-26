var praetorianServices = require('praetorian-services');

var Web3 = require('web3');
var ethereumjsWallet = require('ethereumjs-wallet');

var web3 = new Web3();

var defaultProvider = new web3.providers.HttpProvider('/web3')

web3.setProvider(defaultProvider);
web3.eth.defaultAccount = web3.eth.coinbase;

var wallet = ethereumjsWallet.generate();

var contracts = require('praetorian-contracts');
var services = require('praetorian-services');

var compiled = web3.eth.compile.solidity(contracts);

console.log(compiled);

var abi = compiled.Factory.info.abiDefinition;
var code = compiled.Factory.code;

if (sessionStorage.getItem('factory')) {
    web3.eth.contract(abi).at(sessionStorage.getItem('factory'), function (err, contract) {
        console.log('contract', contract.address);
        var partyService = new services.PartyService(contract);

        partyService.create(function(err, party){
            console.log('party', party)
        })
        partyService.list(function(err, parties){
            console.log('partyList', parties)
        })
    });
} else {
    web3.eth.contract(abi).new({
        gas: 2000000,
        data: code
    }, function (err, contract) {
        if (err) console.error(err);
        else if (contract.address) {
            console.log('created contract', contract.address);
            sessionStorage.setItem('factory', contract.address);
        }
    });
}
