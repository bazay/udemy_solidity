// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './Campaign.sol';

contract CampaignFactory {
    address[] public campaigns;
    uint public createPrice;

    event CampaignCreated(address newCampaign);

    constructor(uint _createPrice) {
        createPrice = _createPrice;
    }

    function createCampaign(uint minimum) public payable {
        require(msg.value >= createPrice, 'Insufficient funds provided for campaign creation.');

        address campaignAddress = address(new Campaign(minimum, msg.sender));
        campaigns.push(campaignAddress);
    }

    function getCampaigns() public view returns(address[] memory) {
        return campaigns;
    }
}
