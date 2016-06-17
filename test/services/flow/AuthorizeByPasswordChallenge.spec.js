var assert = require('assert');
var Helper = require('../Helper');

describe('AuthorizeByPasswordChallenge', function () {

    var helper = new Helper(this);

    var accessService;
    
    var passwordService;
    var passwordChallengeContract;
    
    var web3;

    before(function (done) {
        helper.init(function(err, w3){
            web3 = w3;
            done();
        })
    });

    before(function (done) {
        helper.deploy(function (err, services) {
            if (err) return done(err);
            accessService = services.accessService;
            passwordService = services.challengeService;
            done();
        });
    });
    
    
    it('should create an access contract', function(done){
        accessService.find(web3.eth.defaultAccount, function(err, address){
            if(err) return done(err);
            done();
        })
    });
    
    it('should create passwordChallenge contract', function (done) {
        passwordService.create("Willem123", function(err, contract){
            if(err) return done(err)
            passwordChallengeContract = contract;
            done();
        });
    });
    
    
    it('should validate a wallet with a passwordChallenge in an Access contract', function(done){
        passwordService.authorize(passwordChallengeContract, "Willem123", function(err, event){
            if(err) return (done(err))
            assert.equal('success', event);
            done();
        })
    });

    it('should not validate a wallet with wrong password', function(done){
        passwordService.authorize(passwordChallengeContract, "Willem456", function(err, event){
            if(err) return (done(err))
            assert.equal('error', event);
            done();
        })
    });
    
})