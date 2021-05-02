// const Lottery = artifacts.require('Lottery');

// contract('Lottery', (accounts) => {
//   beforeEach(async () => {
//     // Setup lottery
//     const lottery = await Lottery.deployed();
//   });

//   it('deploys a contract', async () => {
//     const lottery = await Lottery.deployed();
//     console.log(lottery);

//     assert.ok(lottery.options.address);
//   });

//   it('sets the owner', async () => {
//     const owner = await lottery.methods.owner().call();
//     assert.equal(owner, accounts[0]);
//   });

//   // describe('#setMessage', () => {
//   //   it('can set the message', async () => {
//   //     await lottery.methods.setMessage("How are you?").send({ from: accounts[1] });
//   //     const message = await lottery.methods.message().call();
//   //     assert.equal(message, "How are you?");
//   //   });
//   // });
// });

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { abi, evm } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of accounts
  accounts = await web3.eth.getAccounts();

  // Use one of the above accounts to deploy the contract
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('sets an owner', async () => {
    const owner = await lottery.methods.owner().call();

    assert.equal(owner, accounts[0]);
  });

  describe('#addPlayer', () => {
    it('allows a new participant', async () => {
      await lottery.methods.addPlayer().send({
        from: accounts[1],
        value: web3.utils.toWei('0.2', 'ether')
      });
      const players = await lottery.methods.getPlayers().call({
        from: accounts[1]
      });

      assert.equal(accounts[1], players[0]);
      assert.equal(1, players.length);
    });

    it('allows multiple participants', async () => {
      await lottery.methods.addPlayer().send({
        from: accounts[1],
        value: web3.utils.toWei('0.2', 'ether')
      });
      await lottery.methods.addPlayer().send({
        from: accounts[2],
        value: web3.utils.toWei('0.3', 'ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[1]
      });

      assert.equal(accounts[1], players[0]);
      assert.equal(accounts[2], players[1]);
      assert.equal(2, players.length);
    });

    it('requires a minimum amount of ether for add participant', async () => {
      try {
        await lottery.methods.addPlayer().send({
          from: accounts[0],
          value: web3.utils.toWei('0.05', 'ether')
        });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });
  });

  describe('#pickWinner', () => {
    it ('only owner can call method', async () => {
      try {
        await lottery.methods.pickWinner().send({
          from: accounts[1]
        });
        assert(false);
      } catch(err) {
        assert(err)
      }
    });

    it('sends money to the winner and resets the lottery', async () => {
      const entryAmount = 2;
      await lottery.methods.addPlayer().send({
        from: accounts[1],
        value: web3.utils.toWei(String(entryAmount), 'ether')
      });
      const initialBalance = await web3.eth.getBalance(accounts[1]);
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      const finalBalance = await web3.eth.getBalance(accounts[1]);
      const difference = finalBalance - initialBalance;
      const gasPriceApprox = 0.2;
      const differenceIncludingGas = entryAmount - gasPriceApprox;

      // Check winner received funds
      assert(difference > web3.utils.toWei(String(differenceIncludingGas), 'ether'));
      const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

      // Check that players is reset to empty array
      assert(Array.isArray(players));
      assert(players.length == 0);
    });
  });
});
