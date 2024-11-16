// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { console } from "forge-std/src/console.sol";
import { Test } from "forge-std/src/Test.sol";

import { CustomSmartWalletFactory } from "../src/custom-smart-wallet/CustomSmartWalletFactory.sol";
import { CustomSmartWallet } from "../src/custom-smart-wallet/CustomSmartWallet.sol";

contract CustomSmartWalletFactoryTest is Test {
    CustomSmartWalletFactory internal customSmartWalletFactory;
    CustomSmartWallet internal customSmartWallet;
    address internal customSmartWalletAddress;

    bytes32 P_X = bytes32(0xd961005d2b19b117c27187fb4bffc0d5b96c8f39eb0c7476fb69e6efc88fa5be);
    bytes32 P_Y = bytes32(0x848150bcbdc70e6545f27070b840f9f5188bb8cad0cab28e107e200be9cde9d2);
    uint256 INITIAL_LIMIT = 1000;

    function setUp() public virtual {
        // deploy CustomSmartWalletFactory
        customSmartWalletFactory = new CustomSmartWalletFactory();
    }

    function test_FactoryCreateWallet() external {
        console.log(address(this));

        // assert wallet address is NOT yet stored in mapping
        (, bool deployedPre) = customSmartWalletFactory.getWalletAddress(address(this), P_X, P_Y, INITIAL_LIMIT);
        assert(deployedPre == false);

        // deploy CustomSmartWallet belonging to address(this)
        customSmartWalletAddress = customSmartWalletFactory.createSmartWallet(
            bytes32(0xd961005d2b19b117c27187fb4bffc0d5b96c8f39eb0c7476fb69e6efc88fa5be),
            bytes32(0x848150bcbdc70e6545f27070b840f9f5188bb8cad0cab28e107e200be9cde9d2),
            1000
        );
    }

    function test_FactoryPrecomputeWallet() external {
        // deploy CustomSmartWallet belonging to address(this)
        customSmartWalletAddress = customSmartWalletFactory.createSmartWallet(
            bytes32(0xd961005d2b19b117c27187fb4bffc0d5b96c8f39eb0c7476fb69e6efc88fa5be),
            bytes32(0x848150bcbdc70e6545f27070b840f9f5188bb8cad0cab28e107e200be9cde9d2),
            1000
        );

        // assert wallet address can be precomputed
        assert(
            customSmartWalletAddress
                == customSmartWalletFactory.precomputeWalletAddress(address(this), P_X, P_Y, INITIAL_LIMIT)
        );

        // assert wallet address is different when using a different owner
        assert(
            customSmartWalletAddress
                != customSmartWalletFactory.precomputeWalletAddress(address(123), P_X, P_Y, INITIAL_LIMIT)
        );
    }

    function test_FactoryGetWallet() external {
        // deploy CustomSmartWallet belonging to address(this)
        customSmartWalletAddress = customSmartWalletFactory.createSmartWallet(
            bytes32(0xd961005d2b19b117c27187fb4bffc0d5b96c8f39eb0c7476fb69e6efc88fa5be),
            bytes32(0x848150bcbdc70e6545f27070b840f9f5188bb8cad0cab28e107e200be9cde9d2),
            1000
        );

        // assert wallet address is stored in mapping
        (address walletAddress, bool deployedPost) =
            customSmartWalletFactory.getWalletAddress(address(this), P_X, P_Y, INITIAL_LIMIT);
        assert(walletAddress == customSmartWalletAddress);
        assert(deployedPost == true);
    }
}
