// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping (address => bool) voters;
        uint approvalCount;
    }

    address public owner;
    uint public minimumContribution;
    mapping (address => uint) public contributors;
    uint public contributorsCount;
    Request[] public requests;

    modifier isOwner() {
        require(msg.sender == owner, 'Only contract owner can perform this action.');
        _;
    }
    modifier isContributor() {
        require(_isContributor(msg.sender), 'Only contributors can vote on requests.');
        _;
    }

    constructor(uint _minimum, address _owner) {
        owner = _owner;
        minimumContribution = _minimum;
    }

    function contribute() public payable {
        require (msg.value >= minimumContribution, 'Minimum contribution not met.');
        require (!_isContributor(msg.sender), 'Already contributed to project.');

        contributors[msg.sender] = msg.value;
        contributorsCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public isOwner {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
    }

    function approveRequest(uint _requestIndex) public isContributor {
        Request storage request = requests[_requestIndex];
        require(!_hasVoted(request, msg.sender), 'Already voted on request.');
        require(!_isRequestComplete(request), 'Voting on this request is closed.');

        request.voters[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint _requestIndex) public isOwner {
        Request storage request = requests[_requestIndex];
        require(!request.complete, 'Request is already finalized.');
        require(request.approvalCount >= (contributorsCount / 2), 'Not enough approvals for request');

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    // private

    function _isContributor(address _contributor) private view returns(bool) {
        return contributors[_contributor] >= minimumContribution;
    }

    function _hasVoted(Request storage _request, address _voter) private view returns(bool) {
        return _request.voters[_voter];
    }

    function _isRequestComplete(Request storage _request) private view returns(bool) {
        return _request.complete;
    }
}
