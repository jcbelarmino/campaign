import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xeF372A0c76d23637c3b6a88135017832C3c945CD'
);

export default instance;