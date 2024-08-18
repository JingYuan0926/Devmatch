// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletInformation {
    struct Wallet {
        string walletName;
        address walletAddress;
        uint256 inGameCurrency;
        uint256 penTokenBalance;
    }

    mapping(address => Wallet) private wallets;
    address[] private walletAddresses;

    // Event to log when a new wallet is added
    event WalletAdded(string walletName, address walletAddress, uint256 inGameCurrency, uint256 penTokenBalance);

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
        address[] memory _walletAddresses,
        uint256[] memory _inGameCurrencies,
        uint256[] memory _penTokenBalances
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
                walletAddress: _walletAddresses[i],
                inGameCurrency: _inGameCurrencies[i],
                penTokenBalance: _penTokenBalances[i]
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
