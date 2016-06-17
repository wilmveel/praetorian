contract Level{

    address creator;

    bytes32 name;
    bytes32[] challenges;

    function Level(bytes32 _name, bytes32[] _challenges){
        creator = msg.sender;
        name = _name;
        challenges = _challenges;
    }

    function get() constant returns (bytes32 _name, bytes32[] _challenges){
        _name = name;
        _challenges = challenges;
        return;
    }

}