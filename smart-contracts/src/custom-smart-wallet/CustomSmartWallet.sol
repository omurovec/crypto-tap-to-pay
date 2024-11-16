// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { P256 } from "@openzeppelin/contracts/utils/cryptography/P256.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

error CustomSmartWallet__InvalidPublicKey();
error CustomSmartWallet__InvalidSignature();
error CustomSmartWallet__InvalidMessageHash();

// TODO:
// [X] - Specify limit
// [X] - Keep track of funds (might not have to do that bc of `hasFunds` function)
// [X] - Extract data from message

contract CustomSmartWallet is Ownable {
    using P256 for bytes32;

    // P256 public key coordinates of the owner (needed for signature verification)
    bytes32 private px;
    bytes32 private py;

    // withdraw limit for claims
    uint256 private withdrawLimit;

    constructor(address owner, bytes32 _px, bytes32 _py, uint256 initialWithdrawLimit) Ownable(owner) {
        // check if valid public key
        if (!_px.isValidPublicKey(_py)) revert CustomSmartWallet__InvalidPublicKey();

        px = _px;
        py = _py;

        withdrawLimit = initialWithdrawLimit;
    }

    /// @dev View function that app can use to check that the wallet has enough funds
    function hasFunds(address token, uint256 amount) external view returns (bool) {
        return IERC20(token).balanceOf(address(this)) >= amount;
    }

    function setWithdrawLimit(uint256 newLimit) external onlyOwner {
        withdrawLimit = newLimit;
    }

    function claimFunds(bytes32 hashedMessage, bytes32 r, bytes32 s, bytes calldata message) external {
        // verify signature
        if (!hashedMessage.verify({ r: r, s: s, qx: px, qy: py })) revert CustomSmartWallet__InvalidSignature();

        // verify that the hashedMessage is a valid hash of the message
        if (keccak256(message) != hashedMessage) revert CustomSmartWallet__InvalidMessageHash();

        // extract data from the message

        // first 20 bytes are the token address
        address token = address(bytes20(message[:20]));
        // next 32 bytes are the amount
        uint256 amount = uint256(bytes32(message[20:52]));

        // transfer the funds
        // IERC20(token).transfer(msg.sender, amount);
    }
}
