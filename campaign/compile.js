const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignFactoryPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const campaignFactorySource = fs.readFileSync(campaignFactoryPath, 'utf8');
const campaignSource = fs.readFileSync(campaignPath, 'utf8');

fs.ensureDirSync(buildPath);

var input = {
  language: 'Solidity',
  sources: {
    'CampaignFactory.sol' : {
        content: campaignFactorySource
    },
    'Campaign.sol' : {
        content: campaignSource
    }
  },
  settings: {
    outputSelection: {
      '*': {
          '*': [ '*' ]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)))

if (output.errors) {
  console.log('COMPILE FAILED:');
  console.log(output.errors);
  return
}

for (let contract in output.contracts) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace('.sol', '') + '.json'),
    output.contracts[contract][contract.replace('.sol', '')]
  );
}

console.log('COMPILE SUCCESSFUL');
console.log('Files added to: ' + buildPath);
