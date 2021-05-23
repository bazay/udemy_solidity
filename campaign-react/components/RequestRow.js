import React, { Component } from "react";
import { Table, Button, Popup } from 'semantic-ui-react';
import web3 from '../lib/web3';
import Campaign from '../lib/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
    finalizing: false,
    approving: false
  }

  onApprove = async () => {
    if (this.state.approving) { return }

    this.setState({ approving: true });

    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .approveRequest(this.props.id)
        .send({
          from: accounts[0]
        });

        Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch(err) {
      this.setState({ approving: false });

      alert(err.message);
    }
  }

  onFinalize = async () => {
    if (this.state.finalizing) { return }

    this.setState({ finalizing: true });

    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({
          from: accounts[0]
        });

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch(err) {
      this.setState({ finalizing: false });

      alert(err.message);
    }
  }

  render() {
    const { Row, Cell } = Table;
    const { id, request, contributorsCount } = this.props;
    const readyToFinalize = request.approvalCount > contributorsCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{contributorsCount}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove} loading={this.state.approving}>Approve</Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
          <Button color="teal" basic onClick={this.onFinalize} loading={this.state.finalizing}>Finalize</Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
