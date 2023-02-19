//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/* Errors */
error DeFaS_NotEnoughMoneyInYourWallet();
error DeFaS_ContestISFull();
error DeFaS_ProvideEqualEntreeFee();
error DeFaS__UpkeepNotNeeded();
 error DeFas_WinnerIsAlreadyAnnounced();
contract DeFaS is Ownable,VRFConsumerBaseV2 ,AutomationCompatibleInterface {
    /* Type declarations */
    enum DeFaSState {
        Preview,
        GoingOn,
        Closed
    }
//vrf stuffs

VRFCoordinatorV2Interface private immutable vrfCoordinator;


uint256[] internal contestIDToRandomNumber;

    //Game variables
    //Participant- contains all information about players.
    //Contest -shows type of contest and who participated in any individual contest
    struct Contest {
        uint256 maxParticipant;
        uint256 entryFee;
        DeFaSState currentContestStatus;
        uint256 startingTime;
        uint256 closingTime;
    }
    Contest[] public contest;
    mapping(uint256 => address) Winner;
    mapping(address => uint256) participantBalance;

    mapping(uint256 => address[]) contestIDToPlayers;

    mapping(address => uint256[]) participantToContestPlayed;
    mapping(address => uint256[]) participantToRanks;
    /* Events */
    event DeFasStatusOfContestUpdated(
        DeFaSState contestStatus,
        uint256 contestID
    );
    event ContestJoined(address participant, uint256 contestID);

    event ContestCreatedAndJoined(address indexed participant, uint256 contestID);
    event MoneyAddedtoWinner(address indexed  winner, uint256 contestID, uint256 indexed prize);
    event WithDrawnSucessfull(address participant, uint256 amount);
    event LotteryRewardAnnounced(uint256 indexed requestId);
    event ContestClosedNowChooseWinner(uint256 contestID);
    event ContestKickedOFF(uint256 indexed contestID);

    constructor(address vrfCoordinatorV2)VRFConsumerBaseV2(vrfCoordinatorV2) {
          vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);

    }
    
    //modifier for check if partipation is live
    modifier ifStarted(uint256 _contestID) {
        require(
            contest[_contestID].currentContestStatus == DeFaSState.Preview,
            "This Contest is not active at this Time"
        );
        _;
    }

    function set(DeFaSState _status, uint256 contestID) public onlyOwner {
        contest[contestID].currentContestStatus = _status;
        emit DeFasStatusOfContestUpdated(_status, contestID);
    }

    //joinContest

    function joinContest(uint256 contestID) public ifStarted(contestID) {
        //check if contest has not reached to max participant
        if (
            contestIDToPlayers[contestID].length ==
            contest[contestID].maxParticipant
        ) {
            revert DeFaS_ContestISFull();
        }
        if (participantBalance[msg.sender] < contest[contestID].entryFee) {
            revert DeFaS_NotEnoughMoneyInYourWallet();
        }
        participantBalance[msg.sender] -= contest[contestID].entryFee;
        contestIDToPlayers[contestID].push(msg.sender);

        participantToContestPlayed[msg.sender].push(contestID);

        emit ContestJoined(msg.sender, contestID);
    }

    //createContest

    function createContest(
        uint256 _maxParticipant,
        uint256 _entryFee,
        uint256 _startingTime,
        uint256 _closingTime
    ) public {
        require(
            _maxParticipant != 0 &&
                _entryFee != 0 &&
                _startingTime != 0 &&
                _closingTime != 0,
            "MaxParticipant,EntreeFee can not be zero and also provide startingTime and closingTime "
        );

        if (participantBalance[msg.sender] < _entryFee) {
            revert DeFaS_NotEnoughMoneyInYourWallet();
        }
        participantBalance[msg.sender] -= _entryFee;

        contest.push(
            Contest({
                maxParticipant: _maxParticipant,
                entryFee: _entryFee,
                currentContestStatus: DeFaSState.Preview,
                startingTime: _startingTime,
                closingTime: _closingTime
            })
        );

        uint256 newContestID = contest.length;
        contestIDToPlayers[newContestID - 1].push(msg.sender);
        participantToContestPlayed[msg.sender].push(newContestID-1);

        emit ContestCreatedAndJoined(msg.sender, newContestID - 1);
    }

    function AnnounceWinner(uint256 contestID, address winner)
        external
        onlyOwner
    {
       //check if contest is completed or already you have announced result
      if(Winner[contestID]!=address(0)){
            revert  DeFas_WinnerIsAlreadyAnnounced();
        }
        Winner[contestID] = winner;
        uint256 entryFee = contest[contestID].entryFee;
        uint256 totalParticipant = contestIDToPlayers[contestID].length;
        participantBalance[winner] +=
            ((entryFee * totalParticipant) * 90) /
            100;
        uint256 randomness=contestIDToRandomNumber[contestID]%totalParticipant;
    
        address lotterWinner=        contestIDToPlayers[contestID][randomness];
        participantBalance[lotterWinner]+=((entryFee * totalParticipant) * 8) /
            100;
        emit MoneyAddedtoWinner(
            winner,
            contestID,
            ((entryFee * totalParticipant) * 90) / 100
        );
     

       
    }

    //withDraw Money

    function withDrawYourMoney(uint256 amount) external {
        require(
            participantBalance[msg.sender] >= amount,
            "you don't have any balance in your wallet"
        );
        participantBalance[msg.sender] -= amount;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send Ether");
        if (sent) {
            emit WithDrawnSucessfull(msg.sender, amount);

        }
    }


 function toBytes(uint256 x) internal pure returns (bytes memory b) {
        b=abi.encode(x);

    }

    function toUint256(bytes memory b) internal pure returns(uint256 x){
       x=abi.decode(b,(uint256));
    }

    //checkUpkeep
    function checkUpkeep(
        bytes memory /*checkData */
    ) public
        view
        override
        returns (
            bool upkeepNeeded,
             bytes memory performData
        )
 {
     
     uint lastContest=contest.length;
     for(uint i=0;i<lastContest;i++){
         if(contest[i].currentContestStatus!=DeFaSState.Closed){
     if((block.timestamp>contest[i].startingTime && contest[i].currentContestStatus==DeFaSState.Preview)||(block.timestamp>contest[i].closingTime&&contest[i].currentContestStatus==DeFaSState.GoingOn)){
         upkeepNeeded=true;

         return (upkeepNeeded, toBytes(i));
     }
         }
 
    }
    return (upkeepNeeded, "");
 }

    //perform upkeep
    function performUpkeep(
        bytes calldata performData
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");

        if(!upkeepNeeded){
            revert DeFaS__UpkeepNotNeeded();
        }
       
     uint256 contestID=toUint256(performData);
        if(contest[contestID].currentContestStatus==DeFaSState.Preview){
            contest[contestID].currentContestStatus=DeFaSState.GoingOn;
            emit ContestKickedOFF(contestID);
        }else{
      contest[contestID].currentContestStatus=DeFaSState.Closed;

        //Now we can choose the one randome player from this contest to give him 
        //reward 10% contest money
        uint256 requestId=vrfCoordinator.requestRandomWords(
            0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f,//keyHash for mumbai
            3384 ,//SubscriptionId,
            3 ,//Request Confirmation
            500000,//callbackGasLimit
            1//Number of RandomNumber
        );
      emit LotteryRewardAnnounced(requestId);
      emit ContestClosedNowChooseWinner(contestID);

        }
     
    }
    //fullfillRandomWords
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override{

        contestIDToRandomNumber.push(randomWords[0]);

    }



    //getter functions

    function getStatus(uint256 contestID) external view returns (DeFaSState) {
        return contest[contestID].currentContestStatus;
    }

    //get balance of participant
    function getBalance() external view returns (uint256) {
        return participantBalance[msg.sender];
    }

    //get contest fees
    function getContestFee(uint256 contestID) external view returns (uint256) {
        return contest[contestID].entryFee;
    }

    //get  current number of participant in current contest
    function getCurrentNumberofParticipant(uint256 contestID)
        external
        view
        returns (uint256)
    {
        return contestIDToPlayers[contestID].length;
    }

    //get max number of participant in a contest
    function getMaxNumberofParticipant(uint256 contestID)
        external
        view
        returns (uint256)
    {
        return contest[contestID].maxParticipant;
    }

    //get winner of a individual contestID
    function getWinner(uint256 contestID) external view returns (address) {
        return Winner[contestID];
    }

    // getting list of players who has taken part in any individual contest

    function getParticipantInContestID(uint256 contestID)
        external
        view
        returns (address[] memory)
    {
        return contestIDToPlayers[contestID];
    }

    //getting list of contests which has been participated by a participant
    function getContestsOfParticipant(address participant)
        external
        view
        returns (uint256[] memory)
    {
        return participantToContestPlayed[participant];
    }

    function getParticipantToRank(uint256 contestID)
        external
        view
        returns (uint256)
    {
        return participantToRanks[msg.sender][contestID];
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        participantBalance[msg.sender] += msg.value;
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        participantBalance[msg.sender] += msg.value;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}




//contract address=0xfCE997A8F5cCE6c428256E638fa0b9b041DbF9b2 on mumbai 
//https://mumbai.polygonscan.com/address/0xfCE997A8F5cCE6c428256E638fa0b9b041DbF9b2#code
//graph init --contract-name DeFaS --product hosted-service tri-pathi/defas_game  --from-contract 0xfCE997A8F5cCE6c428256E638fa0b9b041DbF9b2  --abi ./abi.json --network mumbai graph


