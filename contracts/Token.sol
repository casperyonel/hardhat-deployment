//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Token {
    string public name = "Casper Coin";
    string public symbol = "CSPR";
    uint public totalSupply = 100000000000;
    mapping(address => uint) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer (address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf (address account) external view returns (uint) {
        return balances[account];
    }
}