import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { CustomSmartWalletFactory__SmartWalletCreated } from "../generated/CustomSmartWalletFactory/CustomSmartWalletFactory"

export function createCustomSmartWalletFactory__SmartWalletCreatedEvent(
  owner: Address,
  smartWalletAddress: Address
): CustomSmartWalletFactory__SmartWalletCreated {
  let customSmartWalletFactorySmartWalletCreatedEvent =
    changetype<CustomSmartWalletFactory__SmartWalletCreated>(newMockEvent())

  customSmartWalletFactorySmartWalletCreatedEvent.parameters = new Array()

  customSmartWalletFactorySmartWalletCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  customSmartWalletFactorySmartWalletCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "smartWalletAddress",
      ethereum.Value.fromAddress(smartWalletAddress)
    )
  )

  return customSmartWalletFactorySmartWalletCreatedEvent
}
