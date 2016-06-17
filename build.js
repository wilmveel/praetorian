var fs = require('fs')
var solc = require('solc');

require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

var contracts = {
    party: require('./contracts/Party.sol'),
    grant: require('./contracts/Grant.sol'),
    Challenge: require('./contracts/Challenge.sol'),
    access: require('./contracts/Access.sol'),
    level: require('./contracts/Level.sol'),
    factory: require('./contracts/Factory.sol')
}

var all = "";
Object.keys(contracts).forEach(function(key) {
    all += contracts[key]
});

var compiled = solc.compile(all,1);
if(compiled.error){
    return console.error(compiled.error);
}
var contracts = JSON.stringify(compiled.contracts)

console.log('compiled', compiled);

fs.writeFile('build/contracts.json', contracts, function(err){
  console.log(err);  
});