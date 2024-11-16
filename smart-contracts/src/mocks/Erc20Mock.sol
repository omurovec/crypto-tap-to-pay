// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev A mock contract for an ERC20 token with mint and burn functions.
contract Erc20Mock is ERC20 {
    constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_) {
        // solhint-disable-previous-line no-empty-blocks
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
