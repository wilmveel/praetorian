contract Party {

    bytes32 name;
    address[] challenges;

    function Party(bytes32 _name) {
        name = _name;
    }

    function get() constant returns (bytes32 _name, address[] _challenges){
        _name = name;
        _challenges = challenges;
        return;
    }

    function getName() constant returns(bytes32){
        return name;
    }

    function getChallenges() constant returns(address[]){
        return challenges;
    }
    
    function addChallenge(address challenge) {
        challenges.push(challenge);
    }

}
