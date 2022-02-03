const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaingAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });
  [campaingAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaingAddress
  );
});

describe("Campaigns", () => {
  it("deploy factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("testa se quem chama é o manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });
  it("permite pessoas contribuirem e marcar como aprovadores", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });
  it("exige uma contribuição mínima", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("permite o gerente fazer o pagamento", async () => {
    
    await campaign.methods
      .createRequest("teste request", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal('teste request', request.description);
  });

   it("process request", async ()=> {
     await campaign.methods.contribute().send({
       from: accounts[0],
       value: web3.utils.toWei('10', 'ether')
     });
     await campaign.methods.createRequest( 'A',  web3.utils.toWei('5', 'ether'), accounts[1])
     .send({from: accounts[0], gas: 1000000 });
     let balance_initial = await web3.eth.getBalance(accounts[1]);
     balance_initial = web3.utils.fromWei(balance_initial, 'ether');
     balance_initial = parseFloat(balance_initial);
     await campaign.methods.approveRequest(0).send({
       from: accounts[0],
       gas: 1000000
     });
     await campaign.methods.finalizeRequest(0).send({
       from: accounts[0],
       gas: 1000000
     });
     let balance = await web3.eth.getBalance(accounts[1]);
     balance = web3.utils.fromWei(balance, 'ether');
     balance = parseFloat(balance);
console.log(balance);
console.log(balance_initial);
     assert(balance > balance_initial)
   });
});
