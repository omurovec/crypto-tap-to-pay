// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { Safe } from "safe-global/safe-smart-account/contracts/Safe.sol";

contract SafeSmartWallet is Safe {
    function id(uint256 value) external pure returns (uint256) {
        return value;
    }
}
