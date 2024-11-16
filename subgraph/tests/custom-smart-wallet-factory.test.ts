import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { CustomSmartWalletFactory__SmartWalletCreated } from "../generated/schema"
import { CustomSmartWalletFactory__SmartWalletCreated as CustomSmartWalletFactory__SmartWalletCreatedEvent } from "../generated/CustomSmartWalletFactory/CustomSmartWalletFactory"
import { handleCustomSmartWalletFactory__SmartWalletCreated } from "../src/custom-smart-wallet-factory"
import { createCustomSmartWalletFactory__SmartWalletCreatedEvent } from "./custom-smart-wallet-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let smartWalletAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCustomSmartWalletFactory__SmartWalletCreatedEvent =
      createCustomSmartWalletFactory__SmartWalletCreatedEvent(
        owner,
        smartWalletAddress
      )
    handleCustomSmartWalletFactory__SmartWalletCreated(
      newCustomSmartWalletFactory__SmartWalletCreatedEvent
    )
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CustomSmartWalletFactory__SmartWalletCreated created and stored", () => {
    assert.entityCount("CustomSmartWalletFactory__SmartWalletCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CustomSmartWalletFactory__SmartWalletCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CustomSmartWalletFactory__SmartWalletCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "smartWalletAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
