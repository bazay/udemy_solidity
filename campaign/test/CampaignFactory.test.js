const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
// const { abi, evm } = require('../build/CampaignFactory.json');
const CampaignFactory = require('../build/CampaignFactory.json');
const Campaign = require('../build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

let createPrice = 100;
let minimumContribution = 100;

beforeEach(async () => {
  // Get a list of accounts
  accounts = await web3.eth.getAccounts();

  // Use one of the above accounts to deploy the contract
  factory = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({
      data: CampaignFactory.evm.bytecode.object,
      arguments: [createPrice]
    })
    .send({ from: accounts[0], gas: '2000000' });

  await factory.methods.createCampaign(minimumContribution).send({
    from: accounts[0],
    gas: '2000000',
    value: 1000
  });

  [campaignAddress] = await factory.methods.getCampaigns().call();
  campaign = await new web3.eth.Contract(
    Campaign.abi,
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const owner = await campaign.methods.owner().call();

    assert.equal(accounts[0], owner);
  });

  it('allows people to contribute and stores their contribution', async () => {
    let contributionAmount = minimumContribution + 100;
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: contributionAmount
    });
    const contributedAmount = await campaign.methods.contributors(accounts[1]).call();

    assert.equal(contributionAmount, contributedAmount);
  });

  it('requires a minimum contribution', async () => {
    let contributionAmount = minimumContribution - 1;

    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: contributionAmount
      })
    } catch(resp) {
      let error = resp.results[Object.keys(resp.results)[0]]

      assert.equal('revert', error.error);
      assert.equal('Minimum contribution not met.', error.reason);
    }
  });

  it('allows a campaign owner to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy something', 100, accounts[1])
      .send({
        from: accounts[0],
        gas: '2000000'
      });
    let request = await campaign.methods.requests(0).call();

    assert.equal('Buy something', request.description);
    assert.equal(100, request.value);
    assert.equal(accounts[1], request.recipient);
  });

  it('processes requests', async () => {
    // Create a contributor
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });
    // Create a spending request
    let recipient = accounts[1];
    let spendAmount = web3.utils.toWei('5', 'ether');
    await campaign.methods
      .createRequest('Buy something', spendAmount, recipient)
      .send({
        from: accounts[0],
        gas: '2000000'
      });
    // Approve the only request
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '2000000'
    });
    let prevBalance = await web3.eth.getBalance(recipient);
    prevBalance = web3.utils.fromWei(prevBalance, 'ether');
    prevBalance = parseFloat(prevBalance);
    // Finalize the request and transfer request value to recipient
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '2000000'
    });
    // Check the recipient received the request value
    let balance = await web3.eth.getBalance(recipient);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    let estimatedIncrease = prevBalance + parseFloat(web3.utils.fromWei(spendAmount, 'ether'));

    assert.equal(estimatedIncrease, balance);
  });
});
