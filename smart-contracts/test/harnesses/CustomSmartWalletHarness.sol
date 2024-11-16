// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { CustomSmartWallet } from "../../src/custom-smart-wallet/CustomSmartWallet.sol";

contract CustomSmartWalletHarness is CustomSmartWallet {
    constructor(
        address owner,
        uint256 initialWithdrawLimit,
        address _token
    )
        CustomSmartWallet(owner, initialWithdrawLimit, _token)
    { }

    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}
