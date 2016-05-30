var praetorianServices = require('praetorian-services');

var Web3 = require('web3');
var ethereumjsWallet = require('ethereumjs-wallet');

var wallet = ethereumjsWallet.generate();

var web3 = new Web3();
var provider = new web3.providers.HttpProvider('/web3')
web3.setProvider(provider);
web3.eth.defaultAccount = web3.eth.coinbase;

var services = new praetorianServices(web3);

console.log('Start');
services.init(sessionStorage.getItem('factory'), function(err, app){
    if(err) return console.error(err)
    sessionStorage.setItem('factory', app.address)


    var event = new Event('praetorianReady', app);
    window.praetorian = app;
    document.dispatchEvent(event);

});
