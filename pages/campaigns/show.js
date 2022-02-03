import React, { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import ContributeForm from "../../components/contributeForm";
import Layout from "../../components/layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const instance = Campaign(props.query.address);
    const summary = await instance.methods.getrSummary().call();
    console.log(summary);
    return {
      campaignAddress: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const items = [
      {
        header: this.props.manager,
        description: "O criador da campanha",
        meta: "Endereço da carteira do gerente da campanha e pode criar os pedidos.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(this.props.balance, "ether"),
        description: "O saldo total da campanha (ETHER)",
        meta: "Saldo da campanha",
      },
      {
        header: this.props.requestsCount,
        description:
          "O pedido de retirada de dinheiro do contrato. O pedido precisa ser aprovado pelos aprovadores",
        meta: "Quantidade de request",
      },
      {
        header: this.props.approversCount,
        description: "Quantidade de pessoas que doaram para a campanha",
        meta: "Quantidade de aprovadores",
      },
      {
        header: this.props.minimumContribution,
        description:
          "O mínimo que é preciso contribuir para se tornar um aprovador ",
        meta: "Contribuição mínima para a campanha (wei)",
      },
    ];
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <h3>Detalhs da Campanha</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={4}>
              <ContributeForm address={this.props.campaignAddress} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                <a>
                  <Button
                    floated="left"
                    content="Requests"
                    icon="zoom in"
                    primary={true}
                    labelPosition="left"
                  />
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}
export default CampaignShow;
