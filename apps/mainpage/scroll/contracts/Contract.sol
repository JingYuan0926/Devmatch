// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyContract {
    // State variable to store data
    uint256 public storedData;

    // Event to emit when data is updated
    event DataUpdated(uint256 newValue);

    // Constructor to initialize stored data
    constructor() {
        storedData = 0;
    }

    // Function to write data to the chain
    function setData(uint256 _newValue) public {
        storedData = _newValue;
        emit DataUpdated(_newValue);
    }

    // Function to read data from the chain
    function getData() public view returns (uint256) {
        return storedData;
    }
}