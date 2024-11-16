// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { CustomSmartWallet } from "src/custom-smart-wallet/CustomSmartWallet.sol";

contract SignUtils {
    bytes32 internal DOMAIN_SEPARATOR;
    bytes32 private constant CLAIM_TYPEHASH = keccak256("Claim(uint256 amount,uint256 nonce)");

    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    // computes the hash of the fully encoded EIP-712 message for the domain, which can be used to recover the signer
    function getTypedDataHash(CustomSmartWallet.Claim calldata claim) public view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, _getStructHash(claim)));
    }

    function _getStructHash(CustomSmartWallet.Claim calldata claim) internal pure returns (bytes32) {
        return keccak256(_encodeClaim(claim));
    }

    function _encodeClaim(CustomSmartWallet.Claim calldata claim) internal pure returns (bytes memory) {
        return abi.encode(CLAIM_TYPEHASH, claim.amount, claim.nonce);
    }
}
