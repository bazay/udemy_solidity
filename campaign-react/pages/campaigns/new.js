import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../lib/factory';
import web3 from '../../lib/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  static async getInitialProps() {
    var campaignPriceWei = await factory.methods.createPrice().call();
    const campaignPriceEther = web3.utils.fromWei(campaignPriceWei, 'ether');

    return { campaignPriceWei, campaignPriceEther };
  }

  state = {
    minimumContribution: '',
    errorMessage: '',
    submitting: false
  };

  onSubmit = async (event) => {
    event.preventDefault();

    // NOTE: Only allow 1 request at a time
    if (this.state.submitting) {
      return
    }

    this.setState({ submitting: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
          value: this.props.campaignPriceWei
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message, submitting: false });
    }
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <p>
          It costs <b>{this.props.campaignPriceEther} ether</b> to create a campaign.<br />
          You will be asked to pay this amount on creating a new campaign.
        </p>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum contribution</label>
            <Input
              label='wei'
              labelPosition='right'
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>

          <Message error header='Oops!' content={this.state.errorMessage} />

          <Button loading={this.state.submitting} primary>Create Campaign</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
