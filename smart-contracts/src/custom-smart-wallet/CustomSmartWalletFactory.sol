// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { CustomSmartWallet } from "./CustomSmartWallet.sol";

error CustomSmartWalletFactory__WalletAlreadyExists();

event CustomSmartWalletFactory__SmartWalletCreated(address indexed owner, address indexed smartWalletAddress);

contract CustomSmartWalletFactory {
    // Mapping from owner address to their deployed smart wallet address
    mapping(address owner => address smartWallet) public smartWallets;

    function createSmartWallet(bytes32 px, bytes32 py, uint256 initialWithdrawLimit) external returns (address) {
        // Check if wallet already exists for this owner
        if (smartWallets[msg.sender] != address(0)) revert CustomSmartWalletFactory__WalletAlreadyExists();

        // Deploy new CustomSmartWallet
        ///@dev https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        bytes32 salt = bytes32(bytes20(uint160(address(msg.sender))));
        CustomSmartWallet smartWallet = new CustomSmartWallet{ salt: salt }(msg.sender, px, py, initialWithdrawLimit);

        // Store wallet address in mapping
        smartWallets[msg.sender] = address(smartWallet);

        emit CustomSmartWalletFactory__SmartWalletCreated(msg.sender, address(smartWallet));

        return address(smartWallet);
    }

    function precomputeWalletAddress(address ownerAddress) public view returns (address) {
        bytes32 salt = bytes32(bytes20(uint160(address(ownerAddress))));
        bytes memory creationCodeValue =
            abi.encodePacked(type(CustomSmartWallet).creationCode, abi.encode(ownerAddress));
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(creationCodeValue)));
        return address(uint160(uint256(hash)));
    }

    function getWalletAddress(address owner) public view returns (address smartWallet, bool deployed) {
        smartWallet = precomputeWalletAddress(owner);
        if (smartWallets[owner] != address(0)) {
            deployed = true;
        }
    }
}
