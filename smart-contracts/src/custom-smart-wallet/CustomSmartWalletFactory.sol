// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { CustomSmartWallet } from "./CustomSmartWallet.sol";

error CustomSmartWalletFactory__WalletAlreadyExists();

event CustomSmartWalletFactory__SmartWalletCreated(address indexed owner, address indexed smartWalletAddress);

contract CustomSmartWalletFactory {
    // Mapping from owner address to their deployed smart wallet address
    mapping(address => address) public smartWallets;

    function createSmartWallet(bytes32 px, bytes32 py, uint256 initialWithdrawLimit) external returns (address) {
        // Check if wallet already exists for this owner
        if (smartWallets[msg.sender] != address(0)) revert CustomSmartWalletFactory__WalletAlreadyExists();

        // Deploy new CustomSmartWallet
        CustomSmartWallet smartWallet = new CustomSmartWallet(msg.sender, px, py, initialWithdrawLimit);

        // Store wallet address in mapping
        smartWallets[msg.sender] = address(smartWallet);

        emit CustomSmartWalletFactory__SmartWalletCreated(msg.sender, address(smartWallet));

        return address(smartWallet);
    }
}
