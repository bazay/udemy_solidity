// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Make sure maths is safe and avoid integer overflow attacks
contract Lottery {
  address payable private _owner;
  string public message;
  address payable[] public players;

  event addedPlayer(address payable player);

  constructor() {
    address payable msgSender = _msgSender();
    _owner = msgSender;
  }

  function addPlayer() public payable minimumEntryFee {
    players.push(_msgSender());
    emit addedPlayer(_msgSender());
  }

  function pickWinner() public onlyOwner {
    uint index = _random() % players.length;
    address payable winner = players[index];

    _transferWinnings(winner);
    _reset();
  }

  function owner() public view virtual returns (address payable) {
    return _owner;
  }

  function getPlayers() public view returns(address payable[] memory) {
    return players;
  }

  function _random() private view returns(uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
  }

  function _transferWinnings(address payable winner) private {
    winner.transfer(address(this).balance);
  }

  function _reset() private {
    players = new address payable[](0);
  }

  function _msgSender() internal view virtual returns (address payable) {
    return payable(msg.sender);
  }

  modifier onlyOwner() {
    require(owner() == _msgSender(), "Ownable: caller is not the owner");
    _;
  }

  modifier minimumEntryFee() {
    require(msg.value > 0.01 ether, "Entrant must pay a minimum fee of 0.01 ether");
    _;
  }
}
