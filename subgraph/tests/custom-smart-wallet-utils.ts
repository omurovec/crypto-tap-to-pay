import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CustomSmartWallet__Transferred,
  CustomSmartWallet__WithdrawLimitChanged,
  EIP712DomainChanged,
  OwnershipTransferred
} from "../generated/CustomSmartWallet/CustomSmartWallet"

export function createCustomSmartWallet__TransferredEvent(
  from: Address,
  to: Address,
  token: Address,
  amount: BigInt
): CustomSmartWallet__Transferred {
  let customSmartWalletTransferredEvent =
    changetype<CustomSmartWallet__Transferred>(newMockEvent())

  customSmartWalletTransferredEvent.parameters = new Array()

  customSmartWalletTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  customSmartWalletTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  customSmartWalletTransferredEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  customSmartWalletTransferredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return customSmartWalletTransferredEvent
}

export function createCustomSmartWallet__WithdrawLimitChangedEvent(
  oldLimit: BigInt,
  newLimit: BigInt
): CustomSmartWallet__WithdrawLimitChanged {
  let customSmartWalletWithdrawLimitChangedEvent =
    changetype<CustomSmartWallet__WithdrawLimitChanged>(newMockEvent())

  customSmartWalletWithdrawLimitChangedEvent.parameters = new Array()

  customSmartWalletWithdrawLimitChangedEvent.parameters.push(
    new ethereum.EventParam(
      "oldLimit",
      ethereum.Value.fromUnsignedBigInt(oldLimit)
    )
  )
  customSmartWalletWithdrawLimitChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newLimit",
      ethereum.Value.fromUnsignedBigInt(newLimit)
    )
  )

  return customSmartWalletWithdrawLimitChangedEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
