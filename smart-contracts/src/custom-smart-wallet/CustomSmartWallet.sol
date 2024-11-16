// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { EIP712 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

error CustomSmartWallet__SignatureAlreadyUsed();
error CustomSmartWallet__InvalidSignature();
error CustomSmartWallet__WithdrawLimitExceeded();

contract CustomSmartWallet is Ownable, EIP712 {
    using ECDSA for bytes32;

    struct Claim {
        uint256 amount;
        uint256 nonce;
    }

    bytes32 public constant CLAIM_TYPEHASH = keccak256("Claim(uint256 amount,uint256 nonce)");

    // token for withdrawal
    address private token;
    // withdraw limit for claims
    uint256 private withdrawLimit;
    // nonce for signatures
    uint256 public nonce;

    /// @dev signature => already used
    mapping(bytes => bool) private usedSignatures;

    constructor(
        address owner,
        uint256 initialWithdrawLimit,
        address _token
    )
        Ownable(owner)
        EIP712("CustomSmartWallet", "1")
    {
        token = _token;
        withdrawLimit = initialWithdrawLimit;
    }

    /// @dev View function that app can use to check that the wallet has enough funds
    function hasFunds(uint256 amount) external view returns (bool) {
        return IERC20(token).balanceOf(address(this)) >= amount;
    }

    function setWithdrawLimit(uint256 newLimit) external onlyOwner {
        withdrawLimit = newLimit;
    }

    function claimFunds(bytes calldata signature, Claim calldata claim) external {
        // verify signature has not been used yet
        if (usedSignatures[signature]) revert CustomSmartWallet__SignatureAlreadyUsed();

        // verify signature
        if (!_verifyClaim(signature, claim, owner())) revert CustomSmartWallet__InvalidSignature();

        // verify amount is below limit
        if (claim.amount > withdrawLimit) revert CustomSmartWallet__WithdrawLimitExceeded();

        // mark signature as used
        usedSignatures[signature] = true;

        // transfer the funds
        IERC20(token).transfer(msg.sender, claim.amount);
    }

    function _verifyClaim(
        bytes calldata signature,
        Claim calldata claim,
        address signer
    )
        internal
        view
        returns (bool)
    {
        return _hashTypedDataV4(keccak256(_encodeClaim(claim))).recover(signature) == signer;
    }

    function _encodeClaim(Claim calldata claim) internal pure returns (bytes memory) {
        return abi.encode(CLAIM_TYPEHASH, claim.amount, claim.nonce);
    }
}
