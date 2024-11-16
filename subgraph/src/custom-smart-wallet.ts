import {
  CustomSmartWallet__Transferred as CustomSmartWallet__TransferredEvent,
  CustomSmartWallet__WithdrawLimitChanged as CustomSmartWallet__WithdrawLimitChangedEvent,
} from "../generated/CustomSmartWallet/CustomSmartWallet"
import {
  CustomSmartWallet__Transferred,
  CustomSmartWallet__WithdrawLimitChanged,
} from "../generated/schema"

export function handleCustomSmartWallet__Transferred(
  event: CustomSmartWallet__TransferredEvent,
): void {
  let entity = new CustomSmartWallet__Transferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCustomSmartWallet__WithdrawLimitChanged(
  event: CustomSmartWallet__WithdrawLimitChangedEvent,
): void {
  let entity = new CustomSmartWallet__WithdrawLimitChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.oldLimit = event.params.oldLimit
  entity.newLimit = event.params.newLimit

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
