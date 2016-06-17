var assert = require('assert');
var crypto = require('crypto');
var jwt = require('../src/jwt');
var secp256k1 = require('secp256k1');

describe('jwt test', function () {

    var payload = "Hello World";

    var privateKey = crypto.randomBytes(32);
    var publicKey = secp256k1.publicKeyCreate(privateKey);


    var token;

    it('should sign token', function(){
        token = jwt.sign(payload,privateKey);
        console.log(token);
    });

    it('should sign token', function(){
        var valid = jwt.verify(token,publicKey);
        assert.equal(valid, true)
    });

});