import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../lib/campaign';
import web3 from '../../../lib/web3';
import { Link, Router } from '../../../routes';

class NewRequest extends Component {
  state = {
    description: '',
    value: '',
    recipient: '',
    errorMessage: '',
    submitting: false
  }

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();

    if (this.state.submitting) { return }

    this.setState({ submitting: true, errorMessage: '' });

    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(value, 'ether'),
          recipient
        )
        .send({
          from: accounts[0]
        });

        Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch(err) {
      this.setState({ errorMessage: err.message, submitting: false });
    }
  }

  render() {
    return (
      <Layout>
        <h3>New Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Amount in ether</label>
            <Input
              value={this.state.value}
              onChange={event =>
                this.setState({ value: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>

          <Message error header='Oops!' content={this.state.errorMessage} />

          <Button primary loading={this.state.submitting}>Create Request</Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
