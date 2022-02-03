import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/layout";
import { Link } from "../../../routes";
import campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/requestRow";
class RequestIndex extends Component {
  static async getInitialProps(props) {
    const instance = campaign(props.query.address);
    const requestCount = await instance.methods.getRequestsCount().call();
    const approversCount = await instance.methods.approversCount().call();
    console.log(`approversCount ${approversCount}`);
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return instance.methods.requests(index).call();
        })
    );
    return {
      campaignAddress: props.query.address,
      requests,
      requestCount,
      approversCount,
    };
  }
  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.campaignAddress}
          approversCount={this.props.approversCount}
        />
      );
    });
  }
  render() {
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button
              style={{ marginBottom: 10 }}
              floated="right"
              content="Novo"
              icon="add circle"
              primary={true}
              labelPosition="left"
            />
          </a>
        </Link>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Descrição</Table.HeaderCell>
              <Table.HeaderCell>Quantidade</Table.HeaderCell>
              <Table.HeaderCell>Recebedor</Table.HeaderCell>
              <Table.HeaderCell>Quantas aprovações?</Table.HeaderCell>
              <Table.HeaderCell>Aprovar</Table.HeaderCell>
              <Table.HeaderCell>Finalizar</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.renderRows()}</Table.Body>
        </Table>
        <div>Encontrados {this.props.requestCount} </div>
      </Layout>
    );
  }
}
export default RequestIndex;
