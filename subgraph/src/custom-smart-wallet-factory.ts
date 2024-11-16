import { CustomSmartWalletFactory__SmartWalletCreated as CustomSmartWalletFactory__SmartWalletCreatedEvent } from "../generated/CustomSmartWalletFactory/CustomSmartWalletFactory"
import { CustomSmartWalletFactory__SmartWalletCreated } from "../generated/schema"

export function handleCustomSmartWalletFactory__SmartWalletCreated(
  event: CustomSmartWalletFactory__SmartWalletCreatedEvent
): void {
  let entity = new CustomSmartWalletFactory__SmartWalletCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.smartWalletAddress = event.params.smartWalletAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
