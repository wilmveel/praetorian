var praetorianServices = require('praetorian-services');

var Web3 = require('web3');
var ethereumjsWallet = require('ethereumjs-wallet');

var HookedWeb3Provider = require('hooked-web3-provider');

var wallet = null;

if (!sessionStorage.getItem('wallet')) {
    wallet = ethereumjsWallet.generate();
    sessionStorage.setItem('wallet', wallet.getPrivateKey().toString('hex'));
} else {
    var privateKey = new Buffer(sessionStorage.getItem('wallet'), 'hex');
    wallet = ethereumjsWallet.fromPrivateKey(privateKey)
}

var web3 = new Web3();

var defaultProvider = new web3.providers.HttpProvider("/web3")
web3.setProvider(defaultProvider);

web3.eth.defaultAccount = web3.eth.coinbase;
web3.eth.sendTransaction({
    from: web3.eth.coinbase,
    to: '0x' + wallet.getAddress().toString('hex'),
    value: web3.toWei(5, "ether"),
    gas: 500000
}, function (err, data) {
    console.log('lalalalalala', err, data)
});

var hookedWeb3Provider = new HookedWeb3Provider({
    host: "/web3",
    transaction_signer: require('./signer')(wallet.getPrivateKey())
});
web3.setProvider(hookedWeb3Provider);
web3.eth.defaultAccount = '0x' + wallet.getAddress().toString('hex');

console.log('privateKey', wallet.getPrivateKey().toString('hex'), '0x' + wallet.getAddress().toString('hex'), web3.eth.coinbase)

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
