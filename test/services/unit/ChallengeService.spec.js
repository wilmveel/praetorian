var async = require('async');
var assert = require('assert');
var Helper = require('../Helper');

describe('ChallengeService', function () {

    var helper = new Helper(this);

    var service;

    before(function (done) {
        helper.init(done);
    });

    before(function (done) {
        helper.deploy(function (err, services) {
            if (err) return done(err);
            service = services.challengeService;
            done();
        });
    });

    it('should return a list of challenges', function (done) {
        service.list(function(err, challenges){
            if(err) return done(err);
            console.log(challenges);

            done();
        });
    });

    it('should create passwordChallenge contract', function (done) {
        service.create("Willem123", function(err, contract){
            if(err) return done(err);
            challengeContract = contract;
            done();
        });
    });

    it('should verify passwordChallenge contract and send success', function (done) {
        service.verify(challengeContract, "Willem123", function(err, event){
            if(err) return done(err);
            assert.equal('success', event);
            done();
        });
    });

    it('should verify passwordChallenge contract and send success', function (done) {
        service.verify(challengeContract, "Willem456", function(err, event){
            if(err) return done(err);
            assert.equal('error', event);
            done();
        });
    });

    it('should change password', function (done) {
        service.change(challengeContract, "Willem123", "Willem456", function(err, event){
            if(err) return done(err);
            assert.equal('success', event);
            done();
        });
    });

    it('should verify password after change and send success', function (done) {
        service.verify(challengeContract, "Willem456", function(err, event){
            if(err) return done(err);
            assert.equal('success', event);
            done();
        });
    });

    it('should verify wrong password after change and send error', function (done) {
        service.verify(challengeContract, "Willem123", function(err, event){
            if(err) return done(err);
            assert.equal('error', event);
            done();
        });
    });


});