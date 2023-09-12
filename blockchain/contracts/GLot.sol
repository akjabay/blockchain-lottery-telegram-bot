// Glot
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GLot is Ownable {
    using SafeMath for uint256;

    IERC20 private token;
    uint256 public playersCount;
    uint256 public lotteryNo;
    uint256 public commissionPercentage;
    uint256 private ticketPrice;
    uint256 public playStartTime;
    uint256 public drawWaitTime = 1 minutes; // Adjust this as needed

    struct Deposit {
        address depositor;
        uint256 amount;
    }

    Deposit[] public players;
    mapping(uint256 => address) public winners;

    // Event for when a player enters the lottery
    event PlayerEntered(address indexed player, uint256 amount);

    // Event for when a winner is drawn
    event WinnerDrawn(address indexed winner, uint256 lotteryNumber, uint256 prizeAmount);


    constructor(
        address _tokenContract,
        uint256 _ticketPrice,
        uint256 _commission
    ) {
        token = IERC20(_tokenContract);
        ticketPrice = _ticketPrice;
        commissionPercentage = _commission;
    }

    function setCommissionFee(uint256 _commission) external onlyOwner {
        require(_commission <= 100, "Commission percentage must be <= 100");
        commissionPercentage = _commission;
    }

    function setTicketPrice(uint256 _ticketPrice) external onlyOwner {
        ticketPrice = _ticketPrice;
    }

    function setToken(address _tokenContract) external onlyOwner {
        token = IERC20(_tokenContract);
    }

    function enter(uint256 amount) external {
        require(
            amount >= ticketPrice,
            "Amount must be equal to ticketPrice"
        );

        token.transferFrom(msg.sender, address(this), amount);


        uint256 numTickets = amount.div(ticketPrice);
        for (uint256 i = 0; i < numTickets; i++) {
            players.push(Deposit(msg.sender, ticketPrice));
            playersCount++;
            if (playersCount == 1) {
                playStartTime = block.timestamp;
            }
        }

        // Emit the PlayerEntered event
        emit PlayerEntered(msg.sender, amount);
    }

    function getRandomIndex() private view returns (uint256) {
        uint256 randomValue = uint256(
            keccak256(
                abi.encodePacked(
                    blockhash(block.number - 1),
                    block.timestamp,
                    playersCount
                )
            )
        );
        return randomValue;
    }

    function canDraw() public view returns (bool) {
        return
            playersCount > 0 &&
            block.timestamp >= playStartTime + drawWaitTime;
    }

    function draw() external onlyOwner returns (address) {
        require(canDraw(), "Cannot pick winner at this time");
        require(playersCount > 0, "No one has entered yet");

        uint256 value = getRandomIndex();
        uint256 index = value % playersCount;
        address winnerAddress = players[index].depositor;

        uint256 contractBalance = token.balanceOf(address(this));
        uint256 fee = (contractBalance.mul(commissionPercentage)) / 100;
        uint256 prizeAmount = contractBalance.sub(fee);

        if (fee > 0) {
            // Transfer fee to owner using token.transfer
            token.transfer(owner(), fee);
        }

        // Transfer prize to winner using token.transfer
        token.transfer(winnerAddress, prizeAmount);

        winners[lotteryNo] = winnerAddress;

        // Emit the WinnerDrawn event
        emit WinnerDrawn(winnerAddress, lotteryNo, prizeAmount);

        lotteryNo++;
        playersCount = 0;
        delete players;

        return winnerAddress;
    }

    function withdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }

    function withdrawAny(address tokenAddress) external onlyOwner {
        require(tokenAddress != address(0), "Address is required");
        IERC20 otherToken = IERC20(tokenAddress);
        uint256 balance = otherToken.balanceOf(address(this));
        otherToken.transfer(owner(), balance);
    }

    // Get play start time
    function getPlayStartTime() external view returns (uint256) {
        return playStartTime;
    }

    // Get play start time
    function getTicketPrice() external view returns (uint256) {
        return ticketPrice;
    }

    // Get draw waiting time
    function getDrawWaitTime() external view returns (uint256) {
        return drawWaitTime;
    }

    function getPlayersCount() external view returns (uint256) {
        return playersCount;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Get winners by lottery number
    function getWinners(uint256 _lotteryNo) external view returns (address) {
        return winners[_lotteryNo];
    }

    function getPlayers()
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory allPlayers = new address[](playersCount);
        uint256[] memory depositAmounts = new uint256[](playersCount);

        for (uint256 i = 0; i < playersCount; i++) {
            allPlayers[i] = players[i].depositor;
            depositAmounts[i] = players[i].amount;
        }

        return (allPlayers, depositAmounts);
    }
}
