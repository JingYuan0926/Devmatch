// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletInformation {
    struct Wallet {
        string walletName;
        string walletAddress; // Already string
        string inGameCurrency; // Change from uint256 to string
        string penTokenBalance; // Change from uint256 to string
    }

    mapping(string => Wallet) private wallets; // Mapping key type is already string
    string[] private walletAddresses; // Array type is already string

    // Event to log when a new wallet is added
    event WalletAdded(string walletName, string walletAddress, string inGameCurrency, string penTokenBalance);

    // Function to clear all existing wallets
    function _clearWallets() internal {
        for (uint256 i = 0; i < walletAddresses.length; i++) {
            delete wallets[walletAddresses[i]];
        }
        delete walletAddresses;
    }

    // Function to bulk upload wallets and replace existing ones
    function bulkUploadWallets(
        string[] memory _walletNames,
        string[] memory _walletAddresses, // Already string[]
        string[] memory _inGameCurrencies, // Change from uint256[] to string[]
        string[] memory _penTokenBalances // Change from uint256[] to string[]
    ) public {
        require(
            _walletNames.length == _walletAddresses.length &&
            _walletAddresses.length == _inGameCurrencies.length &&
            _inGameCurrencies.length == _penTokenBalances.length,
            "Input arrays must have the same length"
        );

        // Clear the existing data
        _clearWallets();

        // Add the new wallets
        for (uint256 i = 0; i < _walletAddresses.length; i++) {
            Wallet memory newWallet = Wallet({
                walletName: _walletNames[i],
                walletAddress: _walletAddresses[i], // Already string
                inGameCurrency: _inGameCurrencies[i], // Now string
                penTokenBalance: _penTokenBalances[i] // Now string
            });

            wallets[_walletAddresses[i]] = newWallet;
            walletAddresses.push(_walletAddresses[i]);

            emit WalletAdded(_walletNames[i], _walletAddresses[i], _inGameCurrencies[i], _penTokenBalances[i]);
        }
    }

    // Function to get all wallet names and their corresponding data
    function getAllWallets() public view returns (Wallet[] memory) {
        Wallet[] memory allWallets = new Wallet[](walletAddresses.length);
        
        for (uint256 i = 0; i < walletAddresses.length; i++) {
            allWallets[i] = wallets[walletAddresses[i]];
        }
        
        return allWallets;
    }
}
