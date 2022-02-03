import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loaded: true,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loaded: false, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      Router.pushRoute("/");
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loaded: true });
  };
  render() {
    return (
      <Layout>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <h3> Criar uma Campanha</h3>
          <Form.Field>
            <label>Contribuição mínima (wei)</label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="100"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
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
export default CampaignNew;
