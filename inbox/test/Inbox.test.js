const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of accounts
  accounts = await web3.eth.getAccounts();

  // Use one of the above accounts to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('gets a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });

  describe('#setMessage', () => {
    it('can set the message', async () => {
      await inbox.methods.setMessage("How are you?").send({ from: accounts[1] });
      const message = await inbox.methods.message().call();
      assert.equal(message, "How are you?");
    });
  });
});
