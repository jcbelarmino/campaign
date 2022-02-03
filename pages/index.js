import React, { Component } from "react";
import { Button, Card } from "semantic-ui-react";
import Layout from "../components/layout";
import factory from "../ethereum/factory";
import { Link } from "../routes";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>Detalhes da Campanha </a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <div>
          <h3> Campanhas abertas</h3>
          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Novo"
                icon="add circle"
                primary={true}
                labelPosition="left"
              />
            </a>
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}
export default CampaignIndex;
