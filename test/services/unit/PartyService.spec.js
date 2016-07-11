var async = require('async');
var assert = require('assert');
var Helper = require('../Helper');
var PartyService = require('../../../src/services/PartyService');

describe('index', function () {

    var helper = new Helper(this);

    var service;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, services) {
            if (err) return done(err);
            service = services.partyService;
            done();
        });
    });

    it('should create party one contract', function (done) {
        service.create("Willem", function (err, address) {
            if (err) return done(err);
            done();
        });
    });

    it('should create two party contracts', function (done) {

        async.parallel([
                function (callback) {
                    service.create('name 1', callback);
                },
                function (callback) {
                    service.create('name2', callback);
                }
            ],
            function (err, results) {
                assert.notEqual(results[0], results[1]);
                done();
            });

    });

    it('should have created three parties', function (done) {

        service.list(function (err, parties) {
            done();
        });

    });

});