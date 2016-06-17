contract Factory {

    event created(address addr);
    event found(address addr);

    address[] private parties;
    address[] private levels;
    bytes32[] private challenges;
    
    mapping(address => address) private walletAccess;

    function Factory() {
        challenges = [
            bytes32('PASSWORD'),
            bytes32('FACEBOOK')
        ];
    }

    function getParties() constant returns (address[]){
        return parties;
    }

    function getChallenges() constant returns (bytes32[]){
        return challenges;
    }

    function getLevels() constant returns (address[]){
        return levels;
    }

    function createParty(bytes32 name) returns (address addr){
        var party = new Party(name);
        parties.push(party);
        created(party);
        return party;
    }

    function createPasswordChallenge(bytes20 response, bytes32 salt) returns (address addr){
        var challenge = new Challenge('PASSWORD', response, salt);
        created(challenge);
        return challenge;
    }

    function createFacebookChallenge(bytes20 response, bytes32 salt) returns (address addr){
        var challenge = new Challenge('FACEBOOK', response, salt);
        created(challenge);
        return challenge;
    }

    function createLevel(bytes32 name, bytes32[] challenges) returns (address addr){
            var level = new Level(name, challenges);
            levels.push(level);
            created(level);
            return level;
        }
    
    function findAccess(address wallet) returns(address addr){
        var access = walletAccess[wallet];
        if(access == 0){
            access = new Access();
            walletAccess[wallet] = address(access);
            created(address(access));
        }
        found(address(access));
        return access;
    }
}