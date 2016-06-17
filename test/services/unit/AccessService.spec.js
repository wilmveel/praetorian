var assert = require('assert');
var Helper = require('../Helper');
var AccessService = require('../../../src/services/AccessService');

describe('AccessService', function () {

    var helper = new Helper(this);

    var web3;
    var service;

    var accessAddress;

    var walletAddress;


    before(function (done) {
        helper.init(function(err, w3){
            web3 = w3;
            done();
        })
    });

    before(function (done) {
        helper.deploy(function (err, services) {
            if (err) return done(err);
            service = services.accessService;
            done();
        });
    });

    before(function (done) {
        web3.eth.getCoinbase(function (err, coinbase) {
            if (err) done(err);
            walletAddress = coinbase;
            done()
        })
    });


    it('should create an access contract', function (done) {
        service.find(walletAddress, function (err, address) {
            if (err) return done(err);
            accessAddress = address;
            assert(address.toString('hex') !== '0x0000000000000000000000000000000000000000');
            done();
        })
    });

    it('should give the access contract', function (done) {
        service.find(walletAddress, function (err, access) {
            if (err) return done(err);
            assert(accessAddress.toString('hex') === access.toString('hex'));
            done();
        })
    });


})