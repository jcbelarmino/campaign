import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class RequestRow extends Component {
  aprovar = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
  };
  finalizar = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    });
  };
  render() {
    const { Cell, Row } = Table;
    const { id, request, address, approversCount } = this.props;
    const prontoParaFinalizar = request.approvalCount > approversCount / 2;
    console.log(request);
    return (
      <Row
        disabled={request.complete}
        positive={prontoParaFinalizar && !request.complete}
      >
        <Cell>{id + 1}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{`${request.approvalCount}/${approversCount}`} </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.aprovar}>
              Aprovar
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.finalizar}>
              Finalizar
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}
export default RequestRow;
