import web3 from './web3';
import CampaignFactory from './../../campaign/build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xC94a65A17F1b52A028D7715DB05961c8b843852B'
);

export default instance;
