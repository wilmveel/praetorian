var praetorianServices = require('praetorian-services');

var Wallet = require('./wallet');


var Web3 = require('web3');

var web3 = new Web3();

// Set default provider
var defaultProvider = new web3.providers.HttpProvider("/web3")
web3.setProvider(defaultProvider);
web3.eth.defaultAccount = web3.eth.coinbase;

// Create wallet
var wallet = new Wallet(web3, sessionStorage.getItem('wallet'));
console.log('address', wallet.getAddress());
sessionStorage.setItem('wallet', wallet.getPrivateKey())

wallet.init(function () {

    // Set wallet provider
    web3.setProvider(wallet.getProvider());
    web3.eth.defaultAccount = wallet.getAddress();


    var services = new praetorianServices(web3);

    console.log('Start');
    services.init(sessionStorage.getItem('factory'), function (err, app) {
        if (err) return console.error(err)
        sessionStorage.setItem('factory', app.address)

        app.factory = services;

        var event = new Event('praetorianReady', app);
        window.praetorian = app;
        document.dispatchEvent(event);

    });
});

