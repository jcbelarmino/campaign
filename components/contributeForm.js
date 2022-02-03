import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    contribution: "",
    errorMessage: "",
    loaded: true
  };

  onSubmit = async (event) => {
    event.preventDefault();
    console.log(`onSubmit: ${this.props.address}`);
    const instance = Campaign(this.props.address);
    this.setState({ loaded: false, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();

      await instance.methods
        .contribute()
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.contribution, "ether"),
        });
        Router.replaceRoute (`/campaigns/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loaded: true });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Contribuição para a campanha !!</label>
          <Input
            label="ether"
            labelPosition="right"
            placeholder="100"
            value={this.state.contribution}
            onChange={(event) =>
              this.setState({ contribution: event.target.value })
            }
          />
        </Form.Field>

        <Message error>
          <Message.Header>Oops!!</Message.Header>
          {this.state.errorMessage}
        </Message>
        <Button loading={!this.state.loaded} primary>
          Contribuir!
        </Button>
      </Form>
    );
  }
}
export default ContributeForm;
