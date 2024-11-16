// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script } from "forge-std/src/Script.sol";
import { CustomSmartWalletFactory } from "../src/custom-smart-wallet/CustomSmartWalletFactory.sol";

contract DeployScript is Script {
    function setUp() public { }

    function run() public {
        // grab pk from `.env`
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        CustomSmartWalletFactory factory = new CustomSmartWalletFactory();

        vm.stopBroadcast();
    }
}

// Flow
// Mantle
// Scroll
// Base
// Polygon
// Zircuit
// Morph
