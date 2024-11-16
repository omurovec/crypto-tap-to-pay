// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { Test } from "forge-std/src/Test.sol";

import { Erc20Mock } from "../src/mocks/Erc20Mock.sol";
import { CustomSmartWallet } from "../src/custom-smart-wallet/CustomSmartWallet.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

/// @dev If this is your first time with Forge, read this tutorial in the Foundry Book:
/// https://book.getfoundry.sh/forge/writing-tests
contract CustomSmartWalletTest is Test {
    Erc20Mock internal mockErc20;
    CustomSmartWallet internal customSmartWallet;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        mockErc20 = new Erc20Mock("Mock Token", "MTK", 18);

        // Instantiate the contract-under-test.
        customSmartWallet = new CustomSmartWallet(
            address(this),
            bytes32(0x7c2cda854c888b3c5ef4ddb5cd827efd4d8fb93545aacaf5db348b9784128957),
            bytes32(0xe55627f354dca80a13e75d7d313bd04ba0a9ae3f0c1a4f6dee6fc0a611d64a3c),
            50e18 // just assumes the token has 18 decimals
        );

        // mint some tokens
        mockErc20.mint(address(customSmartWallet), 100e18);
    }

    function test_claimFunds() external {
        bytes32 hashedMessage = 0x33e817516544cde5b2c41625384b6cd8a46311438a2ccd0c48506ced9a59e133;
        bytes32 r = 0x703e05c727df6f846479cf554b1600a61d69fb03961604b60b95e3fb35733093;
        bytes32 s = 0x0b823f582db05d34e6c7f97c05f34f872e930194c0d415bf9545faf502326a36;
        bytes memory message =
            hex"12345678901234567890123456789012345678900000000000000000000000000000000000000000000000000de0b6b3a7640000";

        customSmartWallet.claimFunds({ hashedMessage: hashedMessage, r: r, s: s, message: message });
    }
}
