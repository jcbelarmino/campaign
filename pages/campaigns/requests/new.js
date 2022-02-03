import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Router, Link } from "../../../routes";

class RequestNew extends Component {
  state = {
    description: "",
    contribution: "",
    address: "",
    errorMessage: "",
    loaded: true,
  };
  static async getInitialProps(props) {
    return {
      campaignAddress: props.query.address,
    };
  }
  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loaded: false, errorMessage: "" });
    const campaign = new Campaign(this.props.campaignAddress);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.contribution, "ether"),
          this.state.address
        )
        .send({
          from: accounts[0],
        });
      Router.pushRoute(`/campaigns/${this.props.campaignAddress}/requests`);
    } catch (error) {
      console.log(error);
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loaded: true });
  };
  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
          <a>voltar!</a>
        </Link>
        <h3> Criar um request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Descrição</label>
            <Input
              placeholder="descrição"
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Quantidade em ETHER</label>
            <Input
              label="ether"
              labelPosition="right"
              placeholder="valor da contribuição"
              value={this.state.contribution}
              onChange={(event) =>
                this.setState({ contribution: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Endereço do Recebedor</label>
            <Input
              label="address"
              labelPosition="right"
              placeholder="0x29837987..."
              value={this.state.address}
              onChange={(event) =>
                this.setState({ address: event.target.value })
              }
            />
          </Form.Field>

          <Message error>
            <Message.Header>Oops!!</Message.Header>
            {this.state.errorMessage}
          </Message>
          <Button loading={!this.state.loaded} primary>
            Criar!
          </Button>
        </Form>
      </Layout>
    );
  }
}
export default RequestNew;
