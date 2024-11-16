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
            bytes32(0xd961005d2b19b117c27187fb4bffc0d5b96c8f39eb0c7476fb69e6efc88fa5be),
            bytes32(0x848150bcbdc70e6545f27070b840f9f5188bb8cad0cab28e107e200be9cde9d2),
            50e18 // just assumes the token has 18 decimals
        );

        // mint some tokens
        mockErc20.mint(address(customSmartWallet), 100e18);
    }

    function test_claimFunds() external {
        bytes32 hashedMessage = 0xe4d0913917d989d1ab859b505e44b82b5f965f2bee770b1326e454b78a4bd461;
        bytes32 r = 0x15c0a726128247fa8915857e30cc0454ca7a6c6ebaecf5b06e0911ec53e30ff6;
        bytes32 s = 0x5f24e9f8ad87806c13a060d21e731d4ac90ed0fda618dd55a8a93b4c16a592b4;
        bytes memory message =
            hex"5615deb798bb3e4dfa0139dfa1b3d433cc23b72f0000000000000000000000000000000000000000000000000de0b6b3a7640000";

        customSmartWallet.claimFunds({ hashedMessage: hashedMessage, r: r, s: s, message: message });
    }
}
