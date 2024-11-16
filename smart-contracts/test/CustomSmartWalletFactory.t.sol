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

    address token = address(1);
    uint256 INITIAL_LIMIT = 100e18;

    function setUp() public virtual {
        // deploy CustomSmartWalletFactory
        customSmartWalletFactory = new CustomSmartWalletFactory();
    }

    function test_FactoryCreateWallet() external {
        console.log(address(this));

        // assert wallet address is NOT yet stored in mapping
        (, bool deployedPre) = customSmartWalletFactory.getWalletAddress(address(this), INITIAL_LIMIT, token);
        assert(deployedPre == false);

        // deploy CustomSmartWallet belonging to address(this)
        customSmartWalletAddress = customSmartWalletFactory.createSmartWallet(INITIAL_LIMIT, token);
    }

    function test_FactoryPrecomputeWallet() external {
        // deploy CustomSmartWallet belonging to address(this)
        customSmartWalletAddress = customSmartWalletFactory.createSmartWallet(INITIAL_LIMIT, token);

        // assert wallet address can be precomputed
        assert(
            customSmartWalletAddress
                == customSmartWalletFactory.precomputeWalletAddress(address(this), INITIAL_LIMIT, token)
        );

        // assert wallet address is different when using a different owner
        assert(
            customSmartWalletAddress
                != customSmartWalletFactory.precomputeWalletAddress(address(123), INITIAL_LIMIT, token)
        );
    }

    function test_FactoryGetWallet() external {
        // deploy CustomSmartWallet belonging to address(this)
        customSmartWalletAddress = customSmartWalletFactory.createSmartWallet(INITIAL_LIMIT, token);

        // assert wallet address is stored in mapping
        (address walletAddress, bool deployedPost) =
            customSmartWalletFactory.getWalletAddress(address(this), INITIAL_LIMIT, token);
        assert(walletAddress == customSmartWalletAddress);
        assert(deployedPost == true);
    }
}
