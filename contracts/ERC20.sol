//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract ERC20 {
    string _name;
    string _symbol;
    uint8 _decimals;
    uint256 _totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    constructor(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
        mint(msg.sender, totalSupply);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Not enough money to transfer");
        balances[to]+=value;
        balances[msg.sender]-=value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(allowances[from][msg.sender] >= value, "Not enough allowance to transfer");
        //from.transfer(to, value);
        balances[to]+=value;
        balances[from]-=value;
        allowances[from][msg.sender]-=value;
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Not enough money to approve");
        allowances[msg.sender][spender]+=value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function burn(address account, uint256 amount) public{
        balances[account]-=amount;
        _totalSupply-=amount;
    }

    function mint(address account, uint256 amount) public{
        balances[account]+=amount;
        _totalSupply+=amount;
    }


}
