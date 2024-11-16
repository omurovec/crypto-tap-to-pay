// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { Test } from "forge-std/src/Test.sol";

import { Erc20Mock } from "../src/mocks/Erc20Mock.sol";
import { CustomSmartWallet } from "../src/custom-smart-wallet/CustomSmartWallet.sol";
import { CustomSmartWalletHarness } from "./harnesses/CustomSmartWalletHarness.sol";
import { SignUtils } from "./SignUtils.t.sol";

/// @dev If this is your first time with Forge, read this tutorial in the Foundry Book:
/// https://book.getfoundry.sh/forge/writing-tests

contract CustomSmartWalletTest is Test {
    Erc20Mock internal mockErc20;
    CustomSmartWalletHarness internal customSmartWallet;
    SignUtils internal signUtils;

    uint256 internal ownerPrivateKey;
    address internal owner;

    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        ownerPrivateKey = 0xA11CE;
        owner = vm.addr(ownerPrivateKey);

        mockErc20 = new Erc20Mock("Mock Token", "MTK", 18);

        // Instantiate the contract-under-test.
        customSmartWallet = new CustomSmartWalletHarness(
            owner,
            50e18, // just assumes the token has 18 decimals
            address(mockErc20)
        );

        signUtils = new SignUtils(customSmartWallet.DOMAIN_SEPARATOR());

        // mint some tokens
        mockErc20.mint(address(customSmartWallet), 100e18);
    }

    function test_claimFunds() external {
        // create signature
        CustomSmartWallet.Claim memory claim = CustomSmartWallet.Claim(10e18, 1);
        bytes32 digest = signUtils.getTypedDataHash(claim);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);

        bytes memory signature = abi.encodePacked(r, s, v);

        // call claimFunds
        customSmartWallet.claimFunds({ signature: signature, claim: claim });
    }
}
