import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ContestClosedNowChooseWinner,
  ContestCreatedAndJoined,
  ContestJoined,
  ContestKickedOFF,
  DeFasStatusOfContestUpdated,
  LotteryRewardAnnounced,
  MoneyAddedtoWinner,
  OwnershipTransferred,
  WithDrawnSucessfull
} from "../generated/DeFaS/DeFaS"

export function createContestClosedNowChooseWinnerEvent(
  contestID: BigInt
): ContestClosedNowChooseWinner {
  let contestClosedNowChooseWinnerEvent = changetype<
    ContestClosedNowChooseWinner
  >(newMockEvent())

  contestClosedNowChooseWinnerEvent.parameters = new Array()

  contestClosedNowChooseWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "contestID",
      ethereum.Value.fromUnsignedBigInt(contestID)
    )
  )

  return contestClosedNowChooseWinnerEvent
}

export function createContestCreatedAndJoinedEvent(
  participant: Address,
  contestID: BigInt
): ContestCreatedAndJoined {
  let contestCreatedAndJoinedEvent = changetype<ContestCreatedAndJoined>(
    newMockEvent()
  )

  contestCreatedAndJoinedEvent.parameters = new Array()

  contestCreatedAndJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  contestCreatedAndJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "contestID",
      ethereum.Value.fromUnsignedBigInt(contestID)
    )
  )

  return contestCreatedAndJoinedEvent
}

export function createContestJoinedEvent(
  participant: Address,
  contestID: BigInt
): ContestJoined {
  let contestJoinedEvent = changetype<ContestJoined>(newMockEvent())

  contestJoinedEvent.parameters = new Array()

  contestJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  contestJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "contestID",
      ethereum.Value.fromUnsignedBigInt(contestID)
    )
  )

  return contestJoinedEvent
}

export function createContestKickedOFFEvent(
  contestID: BigInt
): ContestKickedOFF {
  let contestKickedOffEvent = changetype<ContestKickedOFF>(newMockEvent())

  contestKickedOffEvent.parameters = new Array()

  contestKickedOffEvent.parameters.push(
    new ethereum.EventParam(
      "contestID",
      ethereum.Value.fromUnsignedBigInt(contestID)
    )
  )

  return contestKickedOffEvent
}

export function createDeFasStatusOfContestUpdatedEvent(
  contestStatus: i32,
  contestID: BigInt
): DeFasStatusOfContestUpdated {
  let deFasStatusOfContestUpdatedEvent = changetype<
    DeFasStatusOfContestUpdated
  >(newMockEvent())

  deFasStatusOfContestUpdatedEvent.parameters = new Array()

  deFasStatusOfContestUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "contestStatus",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(contestStatus))
    )
  )
  deFasStatusOfContestUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "contestID",
      ethereum.Value.fromUnsignedBigInt(contestID)
    )
  )

  return deFasStatusOfContestUpdatedEvent
}

export function createLotteryRewardAnnouncedEvent(
  requestId: BigInt
): LotteryRewardAnnounced {
  let lotteryRewardAnnouncedEvent = changetype<LotteryRewardAnnounced>(
    newMockEvent()
  )

  lotteryRewardAnnouncedEvent.parameters = new Array()

  lotteryRewardAnnouncedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  )

  return lotteryRewardAnnouncedEvent
}

export function createMoneyAddedtoWinnerEvent(
  winner: Address,
  contestID: BigInt,
  prize: BigInt
): MoneyAddedtoWinner {
  let moneyAddedtoWinnerEvent = changetype<MoneyAddedtoWinner>(newMockEvent())

  moneyAddedtoWinnerEvent.parameters = new Array()

  moneyAddedtoWinnerEvent.parameters.push(
    new ethereum.EventParam("winner", ethereum.Value.fromAddress(winner))
  )
  moneyAddedtoWinnerEvent.parameters.push(
    new ethereum.EventParam(
      "contestID",
      ethereum.Value.fromUnsignedBigInt(contestID)
    )
  )
  moneyAddedtoWinnerEvent.parameters.push(
    new ethereum.EventParam("prize", ethereum.Value.fromUnsignedBigInt(prize))
  )

  return moneyAddedtoWinnerEvent
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

export function createWithDrawnSucessfullEvent(
  participant: Address,
  amount: BigInt
): WithDrawnSucessfull {
  let withDrawnSucessfullEvent = changetype<WithDrawnSucessfull>(newMockEvent())

  withDrawnSucessfullEvent.parameters = new Array()

  withDrawnSucessfullEvent.parameters.push(
    new ethereum.EventParam(
      "participant",
      ethereum.Value.fromAddress(participant)
    )
  )
  withDrawnSucessfullEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withDrawnSucessfullEvent
}
