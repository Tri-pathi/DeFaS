import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ContestClosedNowChooseWinner } from "../generated/schema"
import { ContestClosedNowChooseWinner as ContestClosedNowChooseWinnerEvent } from "../generated/DeFaS/DeFaS"
import { handleContestClosedNowChooseWinner } from "../src/de-fa-s"
import { createContestClosedNowChooseWinnerEvent } from "./de-fa-s-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let contestID = BigInt.fromI32(234)
    let newContestClosedNowChooseWinnerEvent = createContestClosedNowChooseWinnerEvent(
      contestID
    )
    handleContestClosedNowChooseWinner(newContestClosedNowChooseWinnerEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ContestClosedNowChooseWinner created and stored", () => {
    assert.entityCount("ContestClosedNowChooseWinner", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ContestClosedNowChooseWinner",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contestID",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
