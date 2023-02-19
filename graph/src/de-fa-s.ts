import {
  ContestClosedNowChooseWinner as ContestClosedNowChooseWinnerEvent,
  ContestCreatedAndJoined as ContestCreatedAndJoinedEvent,
  ContestJoined as ContestJoinedEvent,
  ContestKickedOFF as ContestKickedOFFEvent,
  DeFasStatusOfContestUpdated as DeFasStatusOfContestUpdatedEvent,
  LotteryRewardAnnounced as LotteryRewardAnnouncedEvent,
  MoneyAddedtoWinner as MoneyAddedtoWinnerEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  WithDrawnSucessfull as WithDrawnSucessfullEvent
} from "../generated/DeFaS/DeFaS"
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
} from "../generated/schema"

export function handleContestClosedNowChooseWinner(
  event: ContestClosedNowChooseWinnerEvent
): void {
  let entity = new ContestClosedNowChooseWinner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contestID = event.params.contestID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContestCreatedAndJoined(
  event: ContestCreatedAndJoinedEvent
): void {
  let entity = new ContestCreatedAndJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.participant = event.params.participant
  entity.contestID = event.params.contestID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContestJoined(event: ContestJoinedEvent): void {
  let entity = new ContestJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.participant = event.params.participant
  entity.contestID = event.params.contestID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleContestKickedOFF(event: ContestKickedOFFEvent): void {
  let entity = new ContestKickedOFF(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contestID = event.params.contestID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeFasStatusOfContestUpdated(
  event: DeFasStatusOfContestUpdatedEvent
): void {
  let entity = new DeFasStatusOfContestUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.contestStatus = event.params.contestStatus
  entity.contestID = event.params.contestID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLotteryRewardAnnounced(
  event: LotteryRewardAnnouncedEvent
): void {
  let entity = new LotteryRewardAnnounced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestId = event.params.requestId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMoneyAddedtoWinner(event: MoneyAddedtoWinnerEvent): void {
  let entity = new MoneyAddedtoWinner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.winner = event.params.winner
  entity.contestID = event.params.contestID
  entity.prize = event.params.prize

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithDrawnSucessfull(
  event: WithDrawnSucessfullEvent
): void {
  let entity = new WithDrawnSucessfull(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.participant = event.params.participant
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
