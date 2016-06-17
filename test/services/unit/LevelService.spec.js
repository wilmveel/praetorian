var assert = require('assert');
var Helper = require('../Helper');

describe('index', function () {

    var helper = new Helper(this);

    var service;

    before(function (done) {
        helper.init(done)
    });

    before(function (done) {
        helper.deploy(function (err, services) {
            if (err) return done(err);
            service = services.levelService;
            done();
        });
    });

    it('should create level contract', function (done) {
        var name = 'ADMIN';
        var challenges = ['PASSWORD', 'FACEBOOK'];
        service.create(name, challenges, function (err, address) {
            if (err) return done(err);
            done();
        });
    });

    it('should create and get level contract', function (done) {
        var name = 'ADMIN';
        var challenges = ['PASSWORD', 'FACEBOOK'];
        console.log(service.create)
        service.create(name, challenges, function (err, address) {
            if (err) return done(err);
            service.get(address, function (err, level) {
                assert.equal("ADMIN", level.name);
                assert.equal("PASSWORD", level.challenges[0]);
                assert.equal("FACEBOOK", level.challenges[1]);
                done();
            })

        });
    });


    it('should retrieve all level contracts', function (done) {
        service.list(function (err, levels) {
            if (err) return done(err);
            done();
        });
    });


});