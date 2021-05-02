import web3 from './web3';

const address = '0xcc8c71b2695874FE6D0227D5395D2fc37B34A412';
const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
    constant: undefined,
    payable: undefined,
    signature: 'constructor'
  },
  {
    anonymous: false,
    inputs: [ [Object] ],
    name: 'addedPlayer',
    type: 'event',
    constant: undefined,
    payable: undefined,
    signature: '0x5fdc9463a346db73f7f071547b56dc6ff4fb8d269565a69f426df71bf175e382'
  },
  {
    inputs: [],
    name: 'addPlayer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    constant: undefined,
    payable: true,
    signature: '0x27b5db8a'
  },
  {
    inputs: [],
    name: 'getPlayers',
    outputs: [{ name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0x8b5b9ccc'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0x8da5cb5b'
  },
  {
    inputs: [],
    name: 'pickWinner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    constant: undefined,
    payable: undefined,
    signature: '0x5d495aea'
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'players',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    payable: undefined,
    signature: '0xf71d96cb'
  }
]

export default new web3.eth.Contract(abi, address);
