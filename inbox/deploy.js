const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');
const provider = new HDWalletProvider(
  'measure clerk faith scale afford silent fortune eternal beyond gaze weather mask',
  'https://rinkeby.infura.io/v3/0739f6307b9f4bf2a69726646ca018b3'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attemping to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' });

  console.log('Contract deployed to address', result.options.address);
}

deploy();
